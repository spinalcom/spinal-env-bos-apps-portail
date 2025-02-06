/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { ISource } from "../../../interfaces/IConfig";
import { SpinalAPI } from "../SpinalAPI";
import * as lodash from "lodash";

export async function getSourceValue(
  buildingId: string,
  items: any[],
  source: ISource,
  forceUpdate: boolean = false
) {
  const { dynamicIds, obj } = _formatValues(items, forceUpdate);
  const url = _getUrl(items[0]?.type);
  const static_details = await sendListMultipleRequest(
    buildingId,
    dynamicIds,
    url
  );

  for (const detail of static_details) {
    const item = obj[detail.dynamicId];
    if (item) {
      item.groups = _getGroupsId(detail);
      item.endpoint = _getEndpoint(detail, source);
      item.position = _getPos(detail);
    }
  }
}

// export async function getSourceValue(buildingId: string, items: any[], source: ISource, forceUpdate: boolean = false) {
//    const { dynamicIds, obj } = _formatValues(items, forceUpdate);
//    if (isControlPoint(source)) {
//       const controlEnpoints = await sendListMultipleRequest(buildingId, dynamicIds, "/api/v1/node/control_endpoint_list_multiple");
//       _classifyControlPoints(controlEnpoints, obj, source);
//       return;
//    }

//    if (isEndpoint(source)) {
//       const endpoints = await sendListMultipleRequest(buildingId, dynamicIds, "/api/v1/node/endpoint_list_multiple");

//       return;
//    }

//    if (isAttribute(source)) {
//       return;
//    }

// }

export async function getTimeSeriesAsync(
  buildingId: string,
  endpointId: string,
  begin: number,
  end: number
) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    buildingId,
    `/api/v1/endpoint/${endpointId}/timeSeries/read/${begin}/${end}`
  );
  return spinalAPI
    .get(url)
    .then((res: any) => res.data)
    .catch(() => []);
}

async function sendListMultipleRequest(
  buildingId: string,
  dynamicIds: string[],
  argUrl: string,
  size: number = 200
) {
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(buildingId, argUrl);

  const chunked = lodash.chunk(dynamicIds, size);
  const promises = chunked.map((ids) => spinalAPI.post<any>(url, ids));
  return Promise.allSettled(promises).then((result) => {
    return result.reduce((list, { status, value }) => {
      if (
        status === "fulfilled" &&
        (value.status == 200 || value.status == 206)
      )
        list.push(...value.data);
      return list;
    }, []);
  });
}

function _getGroupsId(detail): number[] {
  return (detail.groupParents || []).map((el) => el.dynamicId);
}

function _getEndpoint(detail, source: ISource) {
  if (isControlPoint(source)) {
    return _getControlEndpoint(detail.controlEndpoint, source);
  }

  if (isAttribute(source)) {
    return _getAttibuteAsEndpoint(detail.attributsList, source);
  }

  if (isEndpoint(source)) {
    return detail.endpoints.find((el) => el.name === source.name);
  }
}

function _getPos(detail) {
  const category = (detail.attributsList || []).find(
    (el) => el.name === "Spatial"
  );
  if (category) {
    const attribute = category.attributs.find(
      (el) => el.label === "XYZ center"
    );
    if (attribute) {
      const [x, y, z] = (attribute.value || "").split(";");
      if (x && y && z) {
        return { x: Number(x), y: Number(y), z: Number(z) };
      }
    }
  }
}

function _getControlEndpoint(_c: any[], source: ISource) {
  if (!_c) _c = [];

  for (const { endpoints, profileName } of _c) {
    if (profileName === source.profileName) {
      return endpoints.find((el) => el.name === source.name);
    }
  }
}

function _getAttibuteAsEndpoint(attributes: any[], source: ISource) {
  const category = attributes.find((el) => el.name === source.categoryName);
  if (category) {
    const attribute = category.attributs.find((el) => el.label === source.name);
    if (attribute) {
      return {
        value: attribute.value,
        name: attribute.label,
        category: category.name,
        staticId: category.staticId,
        dynamicId: category.dynamicId,
      };
    }
  }
}

// function _classifyControlPoints(controlEnpoints: any, itemsObj: any, source: ISource) {

//    for (const data of controlEnpoints) {
//       const dynamicId = data[0]?.dynamicId || 0;
//       const item = itemsObj[dynamicId];
//       if (item) item.endpoint = getEndpoint(data);
//    }

// }

function _formatValues(items: any[], forceUpdate: boolean = false) {
  return items.reduce(
    (data: { dynamicIds: any[]; obj: any }, item) => {
      if (!item.endpoint || !item.groups || forceUpdate) {
        data.dynamicIds.push(item.dynamicId);
        data.obj[item.dynamicId] = item;
      }
      return data;
    },
    { dynamicIds: [], obj: {} }
  );
}

function _getUrl(type: string) {
  return type === "geographicRoom"
    ? "/api/v1/room/read_static_details_multiple"
    : "/api/v1/equipment/read_static_details_multiple";
}

function isControlPoint(object: any): object is "controlPoint" {
  return object.type === "controlPoint";
}

function isEndpoint(object: any): object is "endpoint" {
  return object.type === "endpoint";
}

function isAttribute(object: any): object is "attribute" {
  return object.type === "attribute";
}
