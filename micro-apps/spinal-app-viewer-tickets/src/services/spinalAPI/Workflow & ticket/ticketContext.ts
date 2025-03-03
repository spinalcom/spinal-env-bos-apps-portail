import { SpinalAPI } from "../SpinalAPI";

export async function getWorkflowList() {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    "api/v1/workflow/list"
  );
  let result = await spinalAPI.get(url);
  return result.data;
}

export async function getProcessList(workflowId: number) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/workflow/${workflowId}/processList`
  );
  let result = await spinalAPI.get(url);
  return result.data;
}

export async function getStepList(workflowId: number, processId: number) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/workflow/${workflowId}/process/${processId}/stepList`
  );
  let result = await spinalAPI.get(url);
  return result.data;
}

export async function getTicketListMultiple(stepIds: number[]) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/node/ticket_list_multiple`
  );
  let result = await spinalAPI.post(url, stepIds);
  return result.data;
}

export async function getTicketList(nodeId: number) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/node/${nodeId}/ticket_list`
  );
  let result = await spinalAPI.get(url);
  return result.data;
}

export async function getTicketDetailsMultiple(ticketIds: number[]) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/ticket/read_details_multiple`
  );
  const result = await spinalAPI.post(url, ticketIds);
  return result.data.map((d) => ({ ...d, buildingName: "Bâtiment" }));
}

export async function getTicketDetails(ticketId: number) {
  const platformId = localStorage.getItem("idBuilding") || "";
  const spinalAPI = SpinalAPI.getInstance();
  const url = spinalAPI.createUrlWithPlatformId(
    platformId,
    `api/v1/ticket/${ticketId}/read_details`
  );
  const result = await spinalAPI.get(url);
  return { ...result.data, buildingName: "Bâtiment" };
}