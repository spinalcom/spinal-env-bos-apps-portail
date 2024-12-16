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


export enum ActionTypes {
	GET_BUILDINGS = "GET_BUILDINGS",
	GET_BUILDING_BY_ID = "GET_BUILDING_BY_ID",
	OPEN_VIEWER = "OPEN_VIEWER",
	GET_VIEWER_INFO = "GET_VIEWER_INFO",
	SELECT_ITEMS = "SELECT_ITEMS",
	FIT_TO_VIEW_ITEMS = "FIT_TO_VIEW_ITEMS",
	ISOLATE_ITEMS = "ISOLATE_ITEMS",
	UNLOAD_MODEL = "UNLOAD_MODEL",
	GET_FLOORS = "GET_FLOORS",
	GET_ROOMS = "GET_ROOMS",
	GET_EQUIPMENTS = "GET_EQUIPMENTS",
	GET_GROUPS_ITEMS = "GET_GROUPS_ITEMS",
	GET_CATEGORIES_TREE = "GET_CATEGORIES_TREE",
	GET_GROUPS_ITEMS_BY_GEOITEM = "GET_GROUPS_ITEMS_BY_GEOITEM",
	GET_ITEM_CONTROL_POINT = "GET_ITEM_CONTROL_POINT",
	COLOR_ITEMS = "COLOR_ITEMS",
	ADD_SPRITES = "ADD_SPRITES",
	ADD_COMPONENT_AS_SPRITES = "ADD_COMPONENT_AS_SPRITES",
	REGROUP_ITEMS = "REGROUP_ITEMS",
	REMOVE_ALL_SPRITES = "REMOVE_ALL_SPRITES",
	SELECT_SPRITES = "SELECT_SPRITES",
	UPDATE_SELECTED_CHART_ITEMS = "UPDATE_SELECTED_CHART_ITEMS"
}
