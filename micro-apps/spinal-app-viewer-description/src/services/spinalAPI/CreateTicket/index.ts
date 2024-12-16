import { SpinalAPI } from '../SpinalAPI';
export  async function getWorkFlowList(building: string) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(building, 'api/v1/workflow/list'); 
    const res = await spinalAPI.get(url);
    return res.data;
}

export async function getProcess(building: string, workflowId: number) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(building, `api/v1/workflow/${workflowId}/tree`);
    const res = await spinalAPI.get(url);
    return res.data;
}
export interface Ticket { 
    workflow: String;
    process: String;
    nodeDynamicId: number;
    name: String;
    priority: number;
    description: String;
}

export async function createTicket(building: string, data: Ticket ) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(building, 'api/v1/ticket/create_ticket');
    const res = await spinalAPI.post(url, data);
    return res.data;
}
export async function addTicketDoc(building: string, ticketId: number, file: FormData) {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(building, `api/v1/ticket/${ticketId}/add_doc`);
    const res = await spinalAPI.post(url, file);
    return res.data;
}