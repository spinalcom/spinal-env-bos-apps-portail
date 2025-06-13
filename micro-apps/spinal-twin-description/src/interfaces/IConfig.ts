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


export interface IConfig {
	viewButtons: "base" | "advanced";
	BuildingInventory: boolean;
	viewerInfo: { roomRef: boolean; floorRef: boolean; equipments: "all" | "groupItem" | "none" };
	viewerInfoBuilding: { roomRef: boolean; floorRef: boolean; equipments: "all" | "groupItem" | "none" };
	sprites: boolean;
	temporality: ITemporality[];
	application?: IApplication[];
	SpriteComponent: ISpriteComponent[];
	inventory: string;
	profileName: string;
	profileNameRoom: string;
	categorieAttributRoom: string;
	spaceInventaire: ISpaceInventaire[]
	inventaire: ISpaceInventaire[]
	batiment: { profileNameControlePts: string, profileNameAttribut: string }
	floor: { profileNameControlePts: string, profileNameAttribut: string }
	room: { profileNameControlePts: string, profileNameAttribut: string }
	equipement: { profileNameControlePts: string, profileNameAttribut: string }
}

export const enum ITemporality {
	currentValue = "Valeur courante",
	hour = "Heure",
	day = "Journée",
	week = "Semaine",
	month = "Mois",
	year = "Année",
	custom = "Personnalisé",
}

export interface IApplication {
	name: string;
	id: string;
	icon: string;
	description: any;
	onglet: string;
}

export interface ISpaceInventaire {
	ctx: string;
	cat: string;
	grp?: string[]
}

export interface ISpriteComponent {
	ctx?: string;
	categorie?: string;
	value?: any;
	name : string
}
