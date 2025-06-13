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


import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
export async function getBuildingAsync() {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(`/building/read`);
  return result.data;
}

export async function getFileAsync(nodeId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.post(
    `/node/${nodeId}/download_file`,
    null,
    { responseType: "blob" }
  );
  return window.URL.createObjectURL(result.data);
}

export async function getBuildingSpaceTreeAsync() {
  const building = await getBuildingAsync();
  building.children = [...(await getFloorListAsync())];

  for (const child of building.children)
    child.children = [...(await getRoomListAsync(child.dynamicId))];
  return building;
}

export async function getPositionAsync(dynamicId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(
    `equipement/${dynamicId}/get_postion`
  );
  return result.data;
}

export async function getFloorListAsync() {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(`floor/list`);
  return result.data;
}
export async function getRoomListAsync(floorId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(
    `floor/${floorId}/room_list`
  );
  return result.data;
}

// Tickets de maintenances
export async function getWorkflowListAsync() {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(`workflow/list`);
  return result.data;
}

export async function getProcessListAsync(workflowId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(
    `workflow/${workflowId}/processList`
  );
  return result.data;
}

export async function getStepListAsync(workflowId: number, processId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(
    `workflow/${workflowId}/process/${processId}/stepList`
  );
  return result.data;
}

export async function getTicketListAsync(nodeIds: number[]) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.post(
    `node/ticket_list_multiple`, 
    nodeIds
  );
  return result.data;
}

export async function getTicketWorkflowAsync() {
  const result = await getWorkflowListAsync();
  return result[0];
}

export async function getWorkflowTreeAsync(workflowId: number) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(
    `workflow/${workflowId}/tree`
  );
  return result.data;
}

export async function getTicketDetailsAsync(ticketsId: number[]) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.post(
    `ticket/read_details_multiple`,
    ticketsId
  );
  return result.data;
}