
import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
import { chunkArray } from './utils.js';

/**
  * Get the attributes of a list of tickets.
  * @param {string} bid Building ID
  * @param {array} ticketList List of tickets
  * @returns {array} List of tickets with attributes
  */
async function getAttributes(bid, ticketList) {
  const ticketIds = ticketList.map(ticket => ticket.ticketId);

  const ticketChunks = chunkArray(ticketIds);

  const chunkPromises = ticketChunks.map(async chunk => {
    const attributeList = await HTTP
      .post(`node/attribute_list_multiple`, chunk);
    return attributeList.data;
  });

  const attributeList = await Promise.all(chunkPromises);
  const flatAttributeList = attributeList.flat();
  const res = mapDates(ticketList, flatAttributeList);
}

function mapDates(ticketList, attributeList) {
  const dateAttributes = [
    'estimatedStartDate',
    'estimatedEndDate',
  ];
  return ticketList.map(ticket => {
    try {
      const attributes = attributeList
        .find(a => a.dynamicId === ticket.ticketId).categoryAttributes
        .find(a => a.name === 'default').attributs
        .filter(a => dateAttributes.includes(a.label))
        .reduce((acc, a) => {
          acc[a.label] = {
            name: a.label === 'estimatedStartDate' ? 'Date de début estimée' : 'Date de fin estimée',
            value: a.value || null,
          };
          return acc;
        }, {});
      if (ticket.dates && ticket.dates.length > 0 && attributes.estimatedStartDate && attributes.estimatedStartDate.value) {
        ticket.dates[0].value = attributes.estimatedStartDate.value;
      }
      if (ticket.dates && ticket.dates.length > 1 && attributes.estimatedEndDate && attributes.estimatedEndDate.value) {
        ticket.dates[1].value = attributes.estimatedEndDate.value;
      }

    } catch (error) {
      console.error(`Error mapping dates for ticket ${ticket.ticketId}, name: ${ticket.name}`, error);
    }
  });
}

/**
  * Get the category ID of a ticket.
  * By default the category name is 'default'.
  * @param {string} bid Building ID
  * @param {string} tid Ticket ID
  * @param {string} categoryName Category name
  */
async function getCategoryId(bid, tid, categoryName = 'default') {
  const categoryList = await HTTP.get(`node/${tid}/categoriesList`);
  const categoryId = categoryList.data.find(c => c.name === categoryName).dynamicId;
  return categoryId;
}

/**
  * Set the estimated start date of a ticket.
  * if the attribute does not exist, it will be created
  * if the attribute exists, it will be updated
  * @param {string} tid Ticket ID
  * @param {string} date Date in milliseconds
  */
async function setEstimatedStart(tid, date) {
  const bid = localStorage.getItem('idBuilding');
  const attribute = {
    attributeLabel: 'estimatedStartDate',
    attributeValue: date,
    attributeType: 'date',
    attributeUnit: 'ms',
  };
  await createAttribute(tid, attribute);
}

/**
  * Set the estimated end date of a ticket.
  * if the attribute does not exist, it will be created.
  * if the attribute exists, it will be updated.
  * @param {string} tid Ticket ID
  * @param {string} date Date in milliseconds
  */
async function setEstimatedEnd(tid, date) {
  const bid = localStorage.getItem('idBuilding');
  const attribute = {
    attributeLabel: 'estimatedEndDate',
    attributeValue: date,
    attributeType: 'date',
    attributeUnit: 'ms',
  };
  await createAttribute(tid, attribute);
}

/**
  * Create attribute for a node.
  * @param {string} tid Ticket ID
  * @param {object} attribute Attribute object
  */
async function createAttribute(tid, attribute) {
  const bid = localStorage.getItem('idBuilding');
  try {
    const categoryID = await getCategoryId(bid, tid);
    await HTTP.post(`node/${tid}/category/${categoryID}/attribut/create`, attribute);
  } catch (error) {
    console.error('Error creating attribute', error);
  }
}

export function setStartEndLimits(nestedList, selected) {
  nestedList.forEach(workflow => {
    workflow.processes.forEach(process => {
      process.dates = process.ticketList.reduce((acc, ticket) => {
        const start = ticket.dates
          .find(date => date.name === selected.selectedStart).value || null;
        const end = ticket.dates
          .find(date => date.name === selected.selectedEnd).value || null;
        if (acc && (!acc.start || start < acc.start)) {
          acc.start = start;
        }
        if (acc && (!acc.end || end > acc.end)) {
          acc.end = end;
        }
        return acc;
      }, { start: null, end: null });
    });
    workflow.dates = workflow.processes.reduce((acc, process) => {
      if (acc && (!acc.start || process.dates.start < acc.start)) {
        acc.start = process.dates.start;
      }
      if (acc && (!acc.end || process.dates.end > acc.end)) {
        acc.end = process.dates.end;
      }
      return acc;
    }, { start: null, end: null });
  });

  console.log('nestedList', nestedList);
}

const dates = {
  getAttributes,
  setEstimatedStart,
  setEstimatedEnd,
  setStartEndLimits,
};

export default dates;
