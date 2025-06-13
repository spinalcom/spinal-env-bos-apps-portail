
import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
import { chunkArray } from './utils.js';

batchSize = 20;
/**
 * Retrieves the location details of equipment related to a list of tickets.
 * @param {tickets[]} ticketList - An array of tickets.
 * @returns {Array<{
 *   ticket: string,
 *   location: {
 *     building: string,
 *     floor: string,
 *     room: string
 *   }
 * }>} An array of objects containing ticket IDs and their associated location details.
 */
async function ticket(ticketList) {
  const elementTypes = [
    'geographicBuilding',
    'geographicFloor',
    'geographicRoom',
    'BIMObject',
  ];
  const groupedByType = Object.groupBy(
    ticketList,
    ({ elementSelected }) => elementSelected.type,
  );
  // Set the location of tickets by building
  getBuildingPosition(groupedByType);
  // Set the location of tickets by floor
  getFloorPosition(groupedByType);
  // Set the location of tickets by room
  await getRoomPosition(groupedByType);
  // Set the location of tickets by equipment
  await getEquipmentPosition(groupedByType);
  const tickets = prepareTickets(groupedByType);
  return tickets;
}

function getBuildingPosition(group) {
  if (!group.geographicBuilding || !group.geographicBuilding.length) {
    return;
  }
  group.geographicBuilding.forEach( (ticket, index) => {
    group.geographicBuilding[index] = {
      location: { 
        building: ticket.elementSelected.dynamicId
      },
      ...ticket,
    };
  });
}

async function getFloorPosition(group) {
  const bid = localStorage.getItem('idBuilding');
  const buildingDynamicIdRequest = await HTTP. get(`building/read`);
  const buildingDynamicId = buildingDynamicIdRequest.data.dynamicId;

  if (!group.geographicFloor || !group.geographicFloor.length) {
    return;
  }
  group.geographicFloor.forEach( (ticket, index) => {
    group.geographicFloor[index] = {
      location: {
        building: buildingDynamicId,
        floor: ticket.elementSelected.dynamicId,
      },
      ...ticket,
    };
  });
}

async function getRoomPosition(group) {
  const bid = localStorage.getItem('idBuilding');
  const roomIds = group.geographicRoom.map(ticket =>
    ticket.elementSelected.dynamicId);
  const chunks = chunkArray(roomIds, 10);
  const roomDetailsRequest = await Promise.all(
    chunks.map(async chunk => {
      const rooms = await HTTP
        .post(`room/get_position_multiple`, chunk);
      return rooms.data;
    })
  );
  const roomDetails = roomDetailsRequest.flat();
  group.geographicRoom.forEach( (ticket, index) => {
    const room = roomDetails.find(r => r.dynamicId === ticket.elementSelected.dynamicId);
    group.geographicRoom[index] = {
      location: {
        building: room.info.building.dynamicId,
        floor: room.info.floor.dynamicId,
        room: room.dynamicId,
      },
      ...ticket,
    };
  });
}

async function getEquipmentPosition(group) {
  const bid = localStorage.getItem('idBuilding');
  const equipmentIds = group.BIMObject.map(ticket =>
    ticket.elementSelected.dynamicId);
  const chunks = chunkArray(equipmentIds, 10);
  const equipmentDetailsRequest = await Promise.all(
    chunks.map(async chunk => {
      const equipments = await HTTP
        .post(`equipment/get_position_multiple`, chunk);
      return equipments.data;
    })
  );
  const equipmentDetails = equipmentDetailsRequest.flat();
  group.BIMObject.forEach( (ticket, index) => {
    try {
      const equipment = equipmentDetails.find(e =>
        e.dynamicId === ticket.elementSelected.dynamicId);
      group.BIMObject[index] = {
        location: {
          building: equipment.info.building.dynamicId,
          floor: equipment.info.floor.dynamicId,
          room: equipment.info.room.dynamicId,
        },
        ...ticket,
      };
    } catch (error) {
      group.BIMObject[index] = {
        location: {
          building: null,
          floor: null,
          room: null,
        },
        ...ticket,
      };
      console.warn('Problem with equipment, setting location to null:', ticket);
    }
  });
}

/**
  * Prepare the ticket list with location details.
  * take objects with array in them and turn them into one array
  * @param {object} group - Object containing ticket lists grouped by type.
  * @returns {Array<{ticket}>} An array of tickets with location details.
  */
function prepareTickets(group) {
  const tickets = Object.values(group).flat();
  return tickets;
}

const locate = {
  ticket
};

export default locate;

