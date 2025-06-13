import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)

async function list(bid) {

  const workflowList = await HTTP
    .get(`workflow/list`);

  return workflowList.data.map( wf => ({
    workflowName: wf.name,
    workflowId: wf.dynamicId,
  }));
}

const workflow = {
  list,
}

export default workflow;

