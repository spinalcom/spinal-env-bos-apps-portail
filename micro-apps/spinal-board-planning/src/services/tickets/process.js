import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)

async function processWorkflowProcesses(bid, workflow) {
  try {
    const processList = await HTTP
      .get(`workflow/${workflow.workflowId}/processlist`);

    if (!processList.data) {
      throw new Error('Invalid response structure');
    }

    return processList.data.map(process => ({
      ...workflow,
      processId: process.dynamicId,
      processName: process.name,
      processColor: process.color,
    }));
  } catch (error) {
    console.error(`Error processing workflow ${workflow.workflowId}`, error);
    return [];
  }
}

async function getProcesses(bid, workflowList) {
  const workflowProcessesPromises = workflowList
    .map(w => processWorkflowProcesses(bid, w));

  const processList = await Promise.all(workflowProcessesPromises);

  return processList.flat();
}

const processes = {
  getProcesses,
};

export default processes;

