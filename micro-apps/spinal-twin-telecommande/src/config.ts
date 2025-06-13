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

	viewButtons: "base",
	viewerInfo: { roomRef: true, floorRef: true, equipments: "all" },

	//donnée pour le lancement de l'app à mettre dans l'url

	//context cat grp des tablettes pour leur affichage
	tabletteContext: "Gestion des équipements",
	tabletteCat: "Scénario Luminaire",
	tabletteGroup: "Tablette",

	//context categories groupe de la piece
	roomContext: "Gestion des espaces",
	roomCat: "Télécommande de confort",

	//affiche tout l'etage si true sinon affiche uniquement la piece / les pieces
	showAllFloor: true,

	// rotation de 90degres
	rotation: false,

	//type d'equipement : all(tout les equipement de la piece) , none(que les sols) , selected(un type selectionné)
	show_equipements: 'selected',

	//si selected ( choisir l'equipement voulu)
	equipementSelections: [
		{
			equipementContext: "Gestion des équipements",
			equipementCat: "Mobilier",
			equipementsGroup: "Bureaux",
			isControlable: true
		},
		{
			equipementContext: "Gestion des équipements",
			equipementCat: "Typologie",
			equipementsGroup: "Lavabo",
			isControlable: false
		}
	],

	//moyen de selection de télécommande : button (pilotage par bouton d'une ou plusieur piece) , room (pilotage en cliquant sur le sol de la piece) , equipement (pilotage en cliquant sur l'equipment)
	// multiple (pilotage par bouton et par sol)
	SelectionType: 'room',

	//les differents type de télécommande

	commandItem: {
		cmd_Light_percent: [
			{
				context: 'Gestion des espaces',
				category: 'CMD_L',
				group: ['Type_1']
			}
		],
		cmd_Light_star: [
			{
				context: 'Gestion des espaces',
				category: 'CMD_L',
				group: ['Type_2']
			}
		],
		cmd_store_on: [
			{
				context: 'Gestion des espaces',
				category: 'CMD_ST',
				group: ['Type_3']
			}
		],
		cmd_store_off: [
			{
				context: 'Gestion des espaces',
				category: 'CMD_ST',
				group: ['Type_4']
			}
		]

	},



	configCommand: {
		temperature: {
			step: 1,
			symbole: true,
			format: [
				{ value: 2, color: '#F0715C' },
				{ value: 1, color: '#FF9685' },
				{ value: 0, color: '#FFA685' },
				{ value: -1, color: '#FFB985' },
				{ value: -2, color: '#FAD9AD' },
			],
			modeString: false,
			unit: '°C'
		},
		cmd_Light_percent: {
			step: 5,
			symbole: false,
			format: [
				{ value: 100, color: '#EDE474' },
				{ value: 75, color: '#B7B362' },
				{ value: 50, color: '#818250' },
				{ value: 25, color: '#4A513E' },
				{ value: 0, color: '#14202C' },
			],
			modeString: false,
			unit: '%'
		},
		cmd_Light_star: {
			step: 1,
			symbole: false,
			format: [
				{ value: 3, color: '#EDE474', string: "***" },
				{ value: 2, color: '#B7B362', string: "**" },
				{ value: 1, color: '#818250', string: "*" },
				{ value: 0, color: '#14202C', string: "0" },
			],
			modeString: true,
			unit: ''
		},
		cmd_store_on: {
			step: 5,
			symbole: false,
			format: [
				{ value: 100, color: '#A8DDF4' },
				{ value: 75, color: '#85B0C4' },
				{ value: 50, color: '#628395' },
				{ value: 25, color: '#3E5665' },
				{ value: 0, color: '#14202C' },
			],
			modeString: false,
			unit: '%'
		}

	}



	//reste a gerer le mlti tablette et les info a ajouter dans la config
};
