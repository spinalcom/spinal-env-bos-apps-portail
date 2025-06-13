import { SpinalAPI } from '../SpinalAPI';
import type {
    IEquipmentItem,
    IBuildingItem,
    IZoneItem,
    IRoomPositionRes,

} from '../../../../../../global-components/SpaceSelector/interfaces/IBuildingItem';



export async function getNodePositionInContext(buildingId: string, contextDynId: number, nodeDynId: number): Promise<IZoneItem[]> {
    const spinalAPI = SpinalAPI.getInstance();
    const url = spinalAPI.createUrlWithPlatformId(buildingId, `api/v1/context/${contextDynId}/node/${nodeDynId}/get_position`);
    let result = await spinalAPI.get<IZoneItem[]>(url);
    return result.data;

}