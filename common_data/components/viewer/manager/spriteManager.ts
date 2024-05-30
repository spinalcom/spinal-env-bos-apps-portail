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

import Vue from "vue";

import { EmitterViewerHandler, VIEWER_SPRITE_CLICK, VIEWER_SPRITE_MOUSEOVER } from "spinal-viewer-event-manager";

interface ISpriteData {
	color: string;
	position: THREE.Vector3;
	dbId: number;
	modelId: string | number;
	data: any;
	component?: Vue;
}

const baseURL = require("../../../assets/circle.svg");


export class SpriteManager {
	private DataVizCore;
	private static _instance: SpriteManager;
	private _dataVizExtn: any;
	private _viewableType;
	private dbIdToViewable: { [key: number | string]: any } = {};
	private label3Ds = [];

	private constructor() { }

	public static getInstance(): SpriteManager {
		if (!this._instance) this._instance = new SpriteManager();
		return this._instance;
	}

	get dataVizExtn() {
		return this._dataVizExtn;
	}

	public async loadDataVisualizationExtension(viewer: Autodesk.Viewing.Viewer3D) {
		this._dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
		await viewer.loadExtension("Autodesk.Edit3D");

		if (!this.DataVizCore) {
			this.DataVizCore = Autodesk.DataVisualization.Core;
			this._viewableType = this.DataVizCore.ViewableType.SPRITE;
		}

		viewer.addEventListener(this.DataVizCore.MOUSE_CLICK, this._onSpriteClicked.bind(this));
		viewer.addEventListener(this.DataVizCore.MOUSE_HOVERING, this._onSpriteHovering.bind(this));
	}

	public async addComponentAsSprite(viewer: Autodesk.Viewing.Viewer3D, data: ISpriteData | ISpriteData[]) {
		data = Array.isArray(data) ? data : [data];


		for (const d of data) {
			if (!d.component) continue;

			const VueComponent = Vue.extend(d.component);
			const vueInstance = new VueComponent({ propsData: d });
			const label = new Autodesk.Edit3D.Label3D(viewer, d.position, "");
			label.container.appendChild(vueInstance.$mount().$el);
			this.label3Ds.push(
				{
					dynamicId: d.data.dynamicId,
					label: label,
					component: vueInstance
				}
			);
		}
	}

	public async selectSprites(dynamicIds: Array<number>) {
		for(let label of this.label3Ds){
			if(dynamicIds.includes(label.dynamicId)){
				label.component._isSelected();
			}
			else{
				label.component._isNotSelected();
			}
		}
	}

	public async createSprite(viewer: Autodesk.Viewing.Viewer3D, data: ISpriteData | ISpriteData[]) {
		const viewableData = new this.DataVizCore.ViewableData();
		viewableData.spriteSize = 24;

		data = Array.isArray(data) ? data : [data];

		for (const item of data) {
			if (!item.position || (item.position.x == null && item.position.y == null && item.position.z == null)) continue;

			const spriteColor = new THREE.Color(item.color);
			const style = new this.DataVizCore.ViewableStyle(this._viewableType, spriteColor, baseURL);

			const viewable = new this.DataVizCore.SpriteViewable(item.position, style, item.dbId);
			viewable.contextData = item.data;

			this.dbIdToViewable[item.dbId] = viewableData;

			this._addSpriteToObject(item.dbId, item.dbId, viewable);
			viewableData.addViewable(viewable);
		}

		await viewableData.finish();
		this._dataVizExtn.addViewables(viewableData);
	}

	public removeSprites() {
		if (this._dataVizExtn) this.dataVizExtn.removeAllViewables();
		this.label3Ds.slice().forEach(l => l.label.dtor());
		this.label3Ds = [];
	}

	private _addSpriteToObject(modelId: string | number, dbId: number, viewable: any) {
		if (!this.dbIdToViewable[modelId]) this.dbIdToViewable[modelId] = {};

		this.dbIdToViewable[modelId][dbId] = viewable;
	}

	private _showOrHideSpritesOnIsolation(isolation: { model: Autodesk.Viewing.Model; ids: number[] }[]) {
	}

	private _converToObject(isolation: { model: Autodesk.Viewing.Model; ids: number[] }[]): { [key: string | number]: number[] } {
		return isolation.reduce((obj, { model, ids }) => {
			if (!obj[model.id]) obj[model.id] = [];
			obj[model.id].push(...ids);
			return obj;
		}, {});
	}

	private _onSpriteHovering(event) {
		this._sendSpriteEvent(event.dbId, VIEWER_SPRITE_MOUSEOVER);
	}

	private _onSpriteClicked(event) {
		this._sendSpriteEvent(event.dbId, VIEWER_SPRITE_CLICK);
	}

	private _sendSpriteEvent(dbId: number, eventName: any) {
		const dataviewable = this.dbIdToViewable[dbId];
		if (!dataviewable) return;

		const viewable = dataviewable.viewables.find((v) => v.dbId === dbId);
		if (viewable && viewable.contextData) {
			const emitter = EmitterViewerHandler.getInstance();
			emitter.emit(eventName, {
				pos: viewable.position,
				style: viewable.style,
				img: viewable.style?.url,
				node: viewable.contextData,
			} as any);
		}
	}
}

export default SpriteManager;
