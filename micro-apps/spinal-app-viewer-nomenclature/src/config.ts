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

import { IConfig, ITemporality } from "./interfaces/IConfig";

export const config: IConfig = {
	// entryPoint: { context: "Espace Cardiweb", category: "isMeetingRoom", group: "Yes" },
	entryPoint: { context: "Gestion des équipements", category: "Typologie", group: "CVC" },
	// entryPoint: {
	// 	context: "Gestion des espaces",
	// 	category: "Typologie",
	// 	group: "Bureaux",
	// },
	viewButtons: "base",
	sprites: true,
	viewerInfo: { roomRef: true, floorRef: true, equipments: "all" },
	temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],
};