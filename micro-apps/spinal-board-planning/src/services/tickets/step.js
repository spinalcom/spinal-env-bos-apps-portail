import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)

async function processProcessesSteps(bid, process) {
  const stepList = await HTTP
    .get(`workflow/${process.workflowId}/process/${process.processId}/stepList`);
  return stepList.data.map(s => ({
    ...process,
    stepId: s.dynamicId,
    stepName: s.name
  }));
}

async function getSteps(bid, processList) {
  const processListStepsPromises = processList
    .map(process => processProcessesSteps(bid, process));

  const stepList = await Promise.all(processListStepsPromises);

  const uniqueSteps = new Set();
  stepList.forEach(steps => steps.forEach(step => uniqueSteps.add(step.stepName)));
  const result = stepList.flat();
  return result;
}

/**
  * Get all steps for a given process
  * @param {string} bid - Building ID
  * @param {string} workflowId - Workflow ID
  * @param {string} processId - Process ID
  * @returns {array} List of steps
  */
async function getStepsByProcess(workflowId, processId) {
  const bid = localStorage.getItem('idBuilding');
  const stepList = await HTTP
    .get(`workflow/${workflowId}/process/${processId}/stepList`);
  const steps = stepList.data.map(s => ({
    name: s.name,
    color: s.color,
    order: s.order,
    dynamicId: s.dynamicId,
  }));
  return steps;
}

const step = {
  getSteps,
  getStepsByProcess,
};

export default step;

