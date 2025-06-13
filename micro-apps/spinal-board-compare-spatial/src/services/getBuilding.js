import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)

export async function getBuilding() {
  const buildingId = localStorage.getItem('idBuilding');
  return await HTTP.get(`building/read`).then((resp) => {
    return resp.data;
  })
}

export async function getFloors() {
  const buildingId = localStorage.getItem('idBuilding');
  let result = await HTTP.get(`floor/list`);
  const res = result.data.map(obj => {
    obj['color'] = '#D138DE';
    return obj;
  })
  return res;
}

export async function getRooms(floor) {
  const buildingId = localStorage.getItem('idBuilding');
  let result = await HTTP.get(`floor/${floor.dynamicId}/room_list`);
  const res = result.data.map(obj => {
    obj['color'] = '#ded638';
    return obj;
  })
  return res;
}

export async function getEquipments(room) {
  const buildingId = localStorage.getItem('idBuilding');
  let result = await HTTP.get(`room/${room.dynamicId}/equipement_list`);
  const res = result.data.map(obj => {
    obj['color'] = '#2693ff';
    return obj;
  })
  return res;
}

