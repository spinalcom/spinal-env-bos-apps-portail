/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
import { addOffsetFromAEC } from './addOffsetFromAEC';
import { getAPINormalisePath } from './getAPINormalisePath';
import { getGlobalOffset } from './getGlobalOffset';
import { loadModel } from './loadModel';
import { load1stThenAll } from './load1stThenAll';
import { getModelById, getModelList } from '../services/ModelDictionnary';
import {
  IDbIdModelAggregate,
  SceneAlignMethod,
  IStartLoadModel,
} from 'spinal-viewer-event-manager';

export function initViewer(
  viewerDiv: HTMLElement
): Promise<Autodesk.Viewing.Viewer3D> {
  return new Promise((resolve) => {
    const options = {
      env: 'Local',
      docid: '',
      useADP: false,
    };
    Autodesk.Viewing.Initializer(options, function () {
      if (viewerDiv) {
        const customProfileSettings = Autodesk.Viewing.DefaultSettings;
        customProfileSettings.lightPreset = 7;
        customProfileSettings.ghosting = false;
        const viewer: Autodesk.Viewing.Viewer3D = new Autodesk.Viewing.Viewer3D(
          viewerDiv,
          customProfileSettings
        );
        resolve(viewer);
      }
    });
  });
}

function addSlash(path: string): string {
  if (path) return path[0] === '/' ? path : '/' + path;
}

export async function load3DModels(
  viewer: Autodesk.Viewing.Viewer3D,
  data: IStartLoadModel
): Promise<void[]> {
  interface IloadModelTask {
    path: string;
    dbids?: number[];
    aecPath?: string;
    id: string;
    name: string;
  }

  const tasks: IloadModelTask[] = [];
  for (const d of data.models) {
    tasks.push({
      path: addSlash(d.path),
      dbids: d.dbids,
      aecPath: addSlash(d.aecPath),
      id: d.id,
      name: d.name,
    });
  }
  return load1stThenAll(
    tasks,
    async (d: IloadModelTask): Promise<void> => {
      // const model =
      await loadBimFile(
        viewer,
        d.path,
        data.loadingType,
        d.id,
        d.dbids,
        d.aecPath,
        data.buildingId
      );
      // addNewModel(d.id, model);
    },
    !viewer.model
  );
}

async function loadBimFile(
  viewer: Autodesk.Viewing.Viewer3D,
  urlpath: string,
  sceneAlignMethod: SceneAlignMethod,
  modelId: string,
  dbids?: number[],
  aecPath?: string,
  buildingId?: string
): Promise<Autodesk.Viewing.Model> {
  const is1stModel = !viewer.model;
  const option: {
    globalOffset?: THREE.Vector3;
    applyRefPoint?: boolean;
    ids?: number[];
  } = {};
  if (dbids) {
    option.ids = dbids;
  }
  if (sceneAlignMethod === SceneAlignMethod.OriginToOrigin) {
    option.globalOffset = getGlobalOffset(viewer);
  } else if (
    sceneAlignMethod === SceneAlignMethod.ShareCoordinates &&
    aecPath
  ) {
    option.applyRefPoint = true;
    option.globalOffset = await addOffsetFromAEC(
      getAPINormalisePath(aecPath, buildingId),
      viewer
    );
  }
  const path = getAPINormalisePath(urlpath, buildingId);
  return loadModel(modelId, viewer, path, option, is1stModel);
}

export function clearSelect(viewer: Autodesk.Viewing.Viewer3D): void {
  viewer.clearSelection();
}

function fireAggregateSelectionChangedEvent(viewer: Autodesk.Viewing.Viewer3D) {
  var perModel = [];
  for (const [, model] of getModelList()) {
    // }

    // for (var i = 0; i < _models.length; i++) {
    var dbIdArray = [];
    var fragIdsArray = [];
    // @ts-ignore
    var sset = model.selector.selectedObjectIds;
    // @ts-ignore
    var instanceTree = model.selector.getInstanceTree();
    for (var p in sset) {
      if (sset[p]) {
        var dbId = parseInt(p);
        if (dbId) {
          dbIdArray.push(dbId);

          if (instanceTree) {
            instanceTree.enumNodeFragments(
              dbId,
              function (fragId) {
                fragIdsArray.push(fragId);
              },
              false
            );
          }
        }
      }
    }

    if (dbIdArray.length) {
      perModel.push({
        fragIdsArray: fragIdsArray,
        dbIdArray: dbIdArray,
        nodeArray: dbIdArray,
        model: model,
      });
    }
  }

  var event = {
    type: Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
    selections: perModel,
  };
  // @ts-ignore
  viewer.impl.api.dispatchEvent(event);
}

export function viewerSelect(
  viewer: Autodesk.Viewing.Viewer3D,
  data: IDbIdModelAggregate[]
): void {
  clearSelect(viewer);
  if (data.length === 1) {
    const d = data[0];
    viewer.select(d.dbIds, getModelById(d.modelId));
  } else {
    for (const d of data) {
      const model = getModelById(d.modelId);
      const ids = typeof d.dbIds === 'number' ? [d.dbIds] : d.dbIds;
      // @ts-ignore
      model.selector.setSelection(ids);
    }
    try {
      fireAggregateSelectionChangedEvent(viewer);
    } catch (e) {
      console.error(
        'error while trying to fire AggregateSelectionChanged Event'
      );
    }
  }
}
function checkdbIds(dbid1: number[], dbid2: number[]): boolean {
  if (dbid1.length !== dbid2.length) return false;
  for (const d1 of dbid1) {
    let found = false;
    for (const d2 of dbid2) {
      if (d1 === d2) {
        found = true;
        break;
      }
    }
    if (found === false) return false;
  }
  return true;
}
function isSameData(
  data1: IDbIdModelAggregate[],
  data2: { ids: number[]; model: Autodesk.Viewing.Model }[]
): boolean {
  if (data1.length !== data2.length) return false;
  for (const d1 of data1) {
    const model = getModelById(d1.modelId);
    let found = false;
    for (const d2 of data2) {
      if (d2.model.id === model.id) {
        if (checkdbIds(d1.dbIds, d2.ids) === false) return false;
        found = true;
        break;
      }
    }
    if (found === false) return false;
  }
  return true;
}

export function viewerIsolation(
  viewer: Autodesk.Viewing.Viewer3D,
  data: IDbIdModelAggregate[]
): void {
  const aggregateIsolation = viewer.getAggregateIsolation();
  if (isSameData(data, aggregateIsolation)) {
    for (const d of aggregateIsolation) {
      viewer.isolate(0, d.model);
    }
  } else {
    const modelDico = getModelList();
    for (const [modelId, model] of modelDico) {
      let found = false;
      for (const d of data) {
        if (modelId == d.modelId) {
          found = true;
          const m = getModelById(d.modelId);
          if (d.dbIds.length > 0) {
            viewer.isolate(d.dbIds, m);
          } else {
            let rootId = m.getRootId();
            m.getObjectTree((tree) => {
              let dbidRoot = tree.nodeAccess.dbIdToIndex[rootId];
              viewer.isolate([dbidRoot], m);
            });
          }
        }
      }
      if (found === false) {
        viewer.hide([1], model);
      }
    }
  }
}

export function viewerFitToView(
  viewer: Autodesk.Viewing.Viewer3D,
  data: IDbIdModelAggregate[]
): void {
  const res = data.map((d) => {
    return {
      model: getModelById(d.modelId),
      selection: d.dbIds,
    };
  });
  // @ts-ignore
  viewer.fitToView(res);
}
