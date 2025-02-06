/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import { ModelManager } from "./modelManager";
import { getViewInfo, getViewInfoFormatted, IViewInfoBody, IViewInfoItemRes, IViewInfoRes, IViewInfoTmpRes, mergeIViewInfo } from "../requests/GeographicContext/getViewInfo";
import { IPlayload, IPlayloadWithComponent } from "../interfaces/IPlayload";
import { EmitterViewerHandler, VIEWER_ADD_SPRITE, VIEWER_INITIALIZED, VIEWER_OBJ_COLOR, VIEWER_OBJ_FIT_TO_VIEW, VIEWER_OBJ_ISOLATE, VIEWER_OBJ_SELECT, VIEWER_START_LOAD_MODEL, ViewerEventWithData, VIEWER_REM_SPHERE } from "spinal-viewer-event-manager";
import { VIEWER_EVENTS } from "../events";
import { ViewerUtils } from "../utils/viewerUtils";
import Vue from "vue";
import { log, warn } from "console";
const emitterHandler = EmitterViewerHandler.getInstance();

export class ViewerManager {
	private static _instance: ViewerManager;
	public viewer: Autodesk.Viewing.Viewer3D;
	public modelManager: ModelManager = ModelManager.getInstance();
	private _buildingInfo: any = {};
	private _viewerStores = {};
	private _viewerIdStocked = [];
	private _viewerStartedList: { [key: string]: Set<string> } = {};
	private spritesByGroup: { data: any; group?: string }[] = [];

	private constructor() { }

	public static getInstance(): ViewerManager {
		if (!this._instance) this._instance = new ViewerManager();
		return this._instance;
	}

	/////////////////////////////////////////////////////////////////////////
	//                           Viewer                                    //
	/////////////////////////////////////////////////////////////////////////

	public initViewer(viewerDiv: HTMLElement): Promise<Autodesk.Viewing.Viewer3D> {
		Autodesk.Viewing.Private.InitParametersSetting.alpha = true;

		return new Promise((resolve) => {
			const options = {
				env: "Local",
				docid: "",
				useADP: false,
			};
			const _self = this;
			Autodesk.Viewing.Initializer(options, function () {
				if (viewerDiv) {
					const customProfileSettings = Autodesk.Viewing.DefaultSettings;
					// customProfileSettings.lightPreset = 7;
					customProfileSettings.ghosting = false;

					// const viewer: Autodesk.Viewing.Viewer3D = new Autodesk.Viewing.GuiViewer3D(viewerDiv, customProfileSettings);
					const viewer: Autodesk.Viewing.Viewer3D = new Autodesk.Viewing.Viewer3D(viewerDiv, customProfileSettings);
					_self.viewer = viewer;
					resolve(viewer);
				}
			});
		});
	}

	public async loadInViewer(item: IPlayload, loadOnlyThisModel: boolean = true, body?: IViewInfoBody & { dbIdsToAdd?: { bimFileId: string; dbIds: number[] }[] }) {


		localStorage.setItem("viewer_loaded", 'unload');
		// if (this._viewerStartedList[item.staticId]) return;
		if (this._viewerStartedList[item.dynamicId]) {
			this.showAllObjects();
			return;
		}

		if (loadOnlyThisModel) {
			const items = Object.keys(this._viewerStartedList);
			await this.unload(items);
		}

		const emitter = EmitterViewerHandler.getInstance();

		emitter.once(VIEWER_INITIALIZED, async () => {
			const buildingId = item.buildingId;
			const dynamicId = item.dynamicId;
			if (!body) body = { dynamicId: [dynamicId], floorRef: true, roomRef: true, equipements: true };

			const res = await this.getViewerInfoMerged(item, body);
			emitter.once(<any>VIEWER_EVENTS.LOADED, (data) => {
				this._addViewLoaded(data.id, data.models);
			});

			const viewerInfo = await getViewInfoFormatted(buildingId, res, item);
			emitter.emit(VIEWER_START_LOAD_MODEL, viewerInfo);
		});
	}

	public async getViewerInfoMerged(argItem: IPlayload | IPlayload[], body?: IViewInfoBody & { dbIdsToAdd?: { bimFileId: string; dbIds: number[] }[] }): Promise<IViewInfoItemRes[]> {

		const datas = await this.getViewerInfo(argItem, undefined, body);
		const res = [];

		for (const _item of datas) {
			mergeIViewInfo(res, _item.data);
		}

		mergeIViewInfo(res, body?.dbIdsToAdd || []);

		return res.map((it: IViewInfoTmpRes): IViewInfoItemRes => {
			return { bimFileId: it.bimFileId, dbIds: Array.from(it.dbIds) };
		});
	}

	public async getViewerInfo(argItem: IPlayload | IPlayload[], argBuildingId?: string, body?: IViewInfoBody): Promise<any[]> {
		if (typeof this._viewerStores["GET_VIEWER_INFO"] === "undefined") {
			this._viewerStores["GET_VIEWER_INFO"] = {};
		}
		const items = Array.isArray(argItem) ? argItem : [argItem];
		const buildingId = argBuildingId || items[0]?.buildingId;
		const ids = items.map((el) => el.dynamicId);
		const res: any[] = [];
		const nodeTofetech: number[] = [];
		
		for (let dynId of ids) {
			if (this._viewerStores["GET_VIEWER_INFO"][dynId]) {
				const itemData = (await this._viewerStores["GET_VIEWER_INFO"][dynId].next())?.value;
				if (itemData) res.push(itemData);
			} else {
				if(!dynId){
					dynId = body?.dynamicId
				}
				this._viewerStores["GET_VIEWER_INFO"][dynId] = generator(dynId, body?.floorRef!, body?.roomRef!, body?.equipements!);
				const itemData = (await this._viewerStores["GET_VIEWER_INFO"][dynId].next())?.value;
				if (itemData) res.push(itemData);
			}
		}
		// const itemstacked = this._viewerIdStocked;

		// if (nodeTofetech.length > 0) {
		// 	if (!body) body = { dynamicId: nodeTofetech, floorRef: true, roomRef: true, equipements: true };
		// 	const dynIds = Array.isArray(body.dynamicId) ? body.dynamicId : [body.dynamicId];
		// 	// const datas = await getViewInfo(buildingId, body);

		// 	for (const dnyid of dynIds) {
		// 		this._viewerStores["GET_VIEWER_INFO"][dnyid] = generator(dnyid, body.floorRef!, body.roomRef!, body.equipements!);
		// 		// res.push(dnyid);
		// 		const itemData = (await this._viewerStores["GET_VIEWER_INFO"][dnyid].next())?.value;
		// 		if (itemData) res.push(itemData);
		// 	}
		// }
		// const idsToAdd = ids.filter(id => !itemstacked.includes(id));


		// if (idsToAdd.length > 0) {
		// 	itemstacked.push(...idsToAdd);
		// }
		// console.log(itemstacked, 'stacked ');

		return res;

		async function* generator(data: number, floorRef: boolean = true, roomRef: boolean = true, equipements: boolean = true): AsyncGenerator<Awaited<any>> {
			let d: IViewInfoRes | undefined = undefined;
			while (true) {
				if (!d) {
					const datas = await getViewInfo(buildingId, {
						dynamicId: [data],
						floorRef,
						equipements,
						roomRef
					});
					d = datas.find((e) => e.dynamicId == data)
				} else
					yield d;
				// add timeout				
			}
		}


	}

	public select(item: IPlayload) {
		return this._fctViewerIteract(VIEWER_OBJ_SELECT, item);
	}



	public hide(item: IPlayload) {
		emitterHandler.emit(VIEWER_REM_SPHERE, item.items);
		// return this._fctViewerIteract(VIEWER_REM_SPHERE, item.items, item.config);
	}



	public isolate(item: IPlayload) {
		this.hide(item) //TODO A BASCULER SUR UNE AUTRE ACTION ..
		return this._fctViewerIteract(VIEWER_OBJ_ISOLATE, item.item, item.config);
	}


	public showAllObjects() {
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_OBJ_ISOLATE as any);
	}

	public fitToView(item: IPlayload) {
		return this._fctViewerIteract(VIEWER_OBJ_FIT_TO_VIEW, item);
	}

	public unload(item: (IPlayload | string) | (IPlayload | string)[]) {
		return this._fctViewerIteract(VIEWER_EVENTS.UNLOAD as any, item);
	}

	public async colorItems(item: IPlayload | IPlayload[], buildingId?: string) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_OBJ_COLOR, formatted as any);
	}

	public async addSprites(item: IPlayload | IPlayload[], buildingId?: string) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(VIEWER_ADD_SPRITE, formatted as any);
	}

	public async addComponentAsSprites(item: IPlayloadWithComponent | IPlayloadWithComponent[], buildingId: string, component?: Vue) {
		const formatted = await this._getAndFormatViewerInfos(item, buildingId, component);
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(<any>VIEWER_EVENTS.VIEWER_ADD_COMPONENT_SPRITE, formatted as any);
	}

	public async getObjectProperties(dbId : number) {
		return ViewerUtils.getInstance().getObjectProperties(this.viewer,dbId)
	}

	public async addCardomponent(item: IPlayloadWithComponent | IPlayloadWithComponent[], buildingId: string, component?: Vue) {
		// console.log("addCardomponent", item);
		const formatted = await this._getAndFormatViewerInfos(item, buildingId, component);
		
		const emitter = EmitterViewerHandler.getInstance();
		emitter.emit(<any>VIEWER_EVENTS.VIEWER_ADD_CARD_COMPONENT, formatted as any);
	}

	//////////////////////////////////////////////////////////////////////////////

	private async _getAndFormatViewerInfos(item: IPlayloadWithComponent | IPlayloadWithComponent[], buildingId?: string, component?: Vue) {
		item = Array.isArray(item) ? item : [item];
		const data :any = []
		// The following code is specifically for the case where item is an array of BimObjects and we already have their bimFileId, dbid and position
		const toFetch : IPlayloadWithComponent [] = []
		for (const it of item) {
			if(it.dynamicId && it.bimFileId && it.dbid){ 
				data.push({dynamicId: it.dynamicId, data: [{bimFileId: it.bimFileId, dbIds: [it.dbid]}]})
			}
			else {
				toFetch.push(it)	
			}
		}
		const lst = await this.getViewerInfo(toFetch, buildingId);
		data.push(...lst)
		//const data = await this.getViewerInfo(item, buildingId);
		const obj = convertToObj(data);
		return item.map((i) => ({
			// dbIds: obj[i.dynamicId]?.dbIds ||[],
			// bimFileId: obj[i.dynamicId]?.bimFileId,
			data: obj[i.dynamicId],
			color: i.color,
			value: i.displayValue,
			modelId: (i as IPlayload).floorId || (i as IPlayload).id || (i as IPlayload).dynamicId,
			parent: Object.assign({}, i),
			position: (i as any).position,
			component: i.component || component,
		}));
	}

	private async _fctViewerIteract(eventName: keyof ViewerEventWithData, playload: (IPlayload | string) | (IPlayload | string)[], isolateConfig?: any,): Promise<any> {

		const emitter = EmitterViewerHandler.getInstance();
		if (eventName === (VIEWER_EVENTS.UNLOAD as any)) {

			playload = Array.isArray(playload) ? playload : [playload];
			const obj = {};
			const modelIds = playload.map((item) => {
				return typeof item === "string" || typeof item === "number" ? item : item?.dynamicId;
			});
			emitter.emit(eventName, modelIds as any);
			playload.forEach((item) => {
				const _tempId = typeof item === "string" || typeof item === "number" ? item : item?.dynamicId;
				this._removeViewLoaded(_tempId);
			});

			return;
		}


		let data: IViewInfoItemRes[];
		if (isolateConfig) {

			const body = {
				dynamicId: playload['dynamicId'],
				floorRef: isolateConfig.viewerInfo.roomRef,
				roomRef: isolateConfig.viewerInfo.roomRef,
				equipements: isolateConfig.viewerInfo.equipments,
			};
			data = await this.getViewerInfoMerged(playload as IPlayload, body);
		} else {
			data = await this.getViewerInfoMerged(playload as IPlayload);
		}

		const res = data.map((it) => {
			return {
				dbIds: it.dbIds,
				bimFileId: it.bimFileId,
				modelId: (playload as IPlayload).floorId || (playload as IPlayload).id || (playload as IPlayload).dynamicId,
			};
		});


		try {
			emitter.emit(eventName, res);
		} catch (error) {
			console.error('Erreur dans emitter.emit :', error);
		}
	}

	private _addViewLoaded(nodeId: string, models: any[]) {
		if (!this._viewerStartedList[nodeId]) this._viewerStartedList[nodeId] = new Set([]);
		for (const model of models) {
			this._viewerStartedList[nodeId].add(model.id);
		}
	}

	private _removeViewLoaded(nodeId: string | number) {
		delete this._viewerStartedList[nodeId];
	}

	private _removeToolbarControl() {
		this.viewer;
	}

}

function convertToObj(arr) {
	return arr.reduce((obj, item) => {
		obj[item.dynamicId] = item.data;
		return obj;
	}, {});
}

export default ViewerManager;
