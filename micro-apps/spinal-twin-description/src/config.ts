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
	// sprites: false,
	viewerInfo: { roomRef: true, floorRef: true, equipments: "all" },
	viewerInfoBuilding: { roomRef: true, floorRef: true, equipments: "all" },
	temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],

	// idAppDescription: "eyJuYW1lIjoiRGVzY3JpcHRpb24iLCJ0eXBlIjoiQnVpbGRpbmdBcHAiLCJpZCI6IjBlZGQtNDI2Zi1hZDc2LTE5MzBiOTM3NmRlIiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTczMTA2Njc5MTA5OCwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzMxMDY2MDMzODg2LCJpY29uIjoibWRpLWJsYWNrLW1lc2EiLCJkZXNjcmlwdGlvbiI6IiIsInRhZ3MiOlsiVmlld2VyIl0sImNhdGVnb3J5TmFtZSI6IiIsImdyb3VwTmFtZSI6IiIsImhhc1ZpZXdlciI6ZmFsc2UsInBhY2thZ2VOYW1lIjoic3BpbmFsLWFwcC12aWV3ZXItZGVzY3JpcHRpb24iLCJpc0V4dGVybmFsQXBwIjpmYWxzZSwibGluayI6IiIsImRvY3VtZW50YXRpb25MaW5rIjoiIiwicmVmZXJlbmNlcyI6e30sInBhcmVudCI6eyJwb3J0b2ZvbGlvSWQiOiIzN2RlLTAyYjgtZTE4Yi0xODUwNjQzYjY4YSIsImJ1aWxkaW5nSWQiOiI1OTMyLTYwODYtOWUxYS0xODUwNjQ3ODQ2MCJ9fQ",
	//DATASIDE vue globale
	//activer les inventaire sur la vue batiments
	BuildingInventory: true,

	//inventaire espace
	spaceInventaire: [
		{
			ctx: 'Gestion des espaces',
			cat: 'Télécommande de confort',
			// grp: ['Bureaux']
		}
	],

	//inventaire equipement
	inventaire: [
		{
			ctx: 'Gestion des équipements',
			cat: 'Typologie',
			// grp: ['Chaises']
		},
		{
			ctx: 'Gestion des équipements',
			cat: 'Mobilier',
			// grp: ['Chaises']
		},
	],


	//plusieur categorie d'attr -> pour les pieces
	//information de selection (attribut / controle endpoint)
	batiment: {
		profileNameControlePts: "KPI", //profil name attribut cbilé batiment
		profileNameAttribut: 'default'// catégorie attribut cbilé batiment
	},
	floor: {
		profileNameControlePts: "KPI USI", // profil name attribut cbilé floor
		profileNameAttribut: "Spatial" // catégorie attribut cbilé floor
	},
	room: {
		profileNameControlePts: "Occupation", // profil name attribut cbilé room
		profileNameAttribut: "Spatial"  // catégorie attribut cbilé room
	},
	equipement: {
		profileNameControlePts: "Multicapteurs", // profil name attribut cbilé floor
		profileNameAttribut: "Spatial" // catégorie attribut cbilé floor
	},



	//TICKET APP
	// categorieAttributRoom: "GMAO",

	//ajout des application disponible depuis description
	//avec name = text dans l'application
	//id de l'app sur PAM
	//profileName du controle point ciblé
	//type de donnée cilbé dans la requetes statickdetails 
	//unit de l'information
	application: [
		{
			name: "INSIGHT",
			id: "Insight",
			icon: "mdi-home-thermometer",
			description: "INSIGHT est une application de surveillance en temps réel des données du bâtiment",
			onglet: "Indicateur",
			config: 'Insight'
		},
		{
			name: "TICKET",
			id: "eyJuYW1lIjoic3BpbmFsLWFwcC12aWV3ZXItdGlja2V0cy1hbGFlZGRpbmUiLCJ0eXBlIjoiQnVpbGRpbmdBcHAiLCJpZCI6IjhiYzAtZmExYS1kMWZhLTE5NTYxYzQyOTI5IiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTc0MTEwMjAxMTk0NCwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzQxMTAyMDAwNDI1LCJpY29uIjoibWRpLXRpY2tldCIsImRlc2NyaXB0aW9uIjoiIiwidGFncyI6W10sImNhdGVnb3J5TmFtZSI6IiIsImdyb3VwTmFtZSI6IiIsImhhc1ZpZXdlciI6ZmFsc2UsInBhY2thZ2VOYW1lIjoic3BpbmFsLWFwcC12aWV3ZXItdGlja2V0cy1hbGFlZGRpbmUiLCJpc0V4dGVybmFsQXBwIjpmYWxzZSwibGluayI6IiIsImRvY3VtZW50YXRpb25MaW5rIjoiIiwicmVmZXJlbmNlcyI6e30sInBhcmVudCI6eyJwb3J0b2ZvbGlvSWQiOiIzN2RlLTAyYjgtZTE4Yi0xODUwNjQzYjY4YSIsImJ1aWxkaW5nSWQiOiI1OTMyLTYwODYtOWUxYS0xODUwNjQ3ODQ2MCJ9fQ",
			icon: "mdi-ticket-outline",
			description: "L'application Ticket permet de visualiser et gérer les tickets d'intervention du bâtiment.",
			onglet: "Tickets"
		},
		{
			name: "NOMENCLATURE",
			id: "eyJuYW1lIjoic3BpbmFsLWFwcC12aWV3ZXItbm9tZW5jbGF0dXJlIiwidHlwZSI6IkJ1aWxkaW5nQXBwIiwiaWQiOiJjZDI3LTgyNDItNWIzYy0xOTU0MjNmMDQ4YyIsImRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3NDA1NzMyMDgyMzEsImluZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTc0MDU3MzE4MTA2OCwiaWNvbiI6Im1kaS1ibGFjay1tZXNhIiwiZGVzY3JpcHRpb24iOiIiLCJ0YWdzIjpbXSwiY2F0ZWdvcnlOYW1lIjoiIiwiZ3JvdXBOYW1lIjoiIiwiaGFzVmlld2VyIjpmYWxzZSwicGFja2FnZU5hbWUiOiJzcGluYWwtYXBwLXZpZXdlci1ub21lbmNsYXR1cmUiLCJpc0V4dGVybmFsQXBwIjpmYWxzZSwibGluayI6IiIsImRvY3VtZW50YXRpb25MaW5rIjoiIiwicmVmZXJlbmNlcyI6e30sInBhcmVudCI6eyJwb3J0b2ZvbGlvSWQiOiIzN2RlLTAyYjgtZTE4Yi0xODUwNjQzYjY4YSIsImJ1aWxkaW5nSWQiOiI1OTMyLTYwODYtOWUxYS0xODUwNjQ3ODQ2MCJ9fQ",
			icon: "mdi-sort-reverse-variant",
			description: "L'application Nomenclature permet de gérer et consulter les attributs des éléments du bâtiment.",
			onglet: "Liste"
		}
	],



	//informaton dans SPRITE COMPONENT
	// name correspond au type de donnée ciblé : controlEndpoint pour ajouter des points de mesure / app pour ajouter des application / attributsList affiche la liste des attributs

	// categorie correspond à la donnée voulu 
	SpriteComponent: [
		{
			name: "attributsList",
			categorie: "Spatial",
			// value:"name"
			// value: null //si string affiche la donnée voulu sinon affiche tout les attributs
		},
		{
			name: "attributsList",
			categorie: "Spatial",
			// value:"name"
			// value: null //si string affiche la donnée voulu sinon affiche tout les attributs
		},


		{
			name: "bimObjects",
			value: true
		},
		// ,
		// {
		// 	name: "controlEndpoint",
		// 	categorie: "Command",
		// 	value: null //si string affiche la donnée voulu sinon affiche tout les endpoints
		// },
		{
			name: "controlEndpoint",
			categorie: "Command",
			value: "COMMAND_LIGHT" //si string affiche la donnée voulu sinon affiche tout les endpoints
		},
		{
			name: "controlEndpoint",
			categorie: "Command",
			value: "COMMAND_BLIND" //si string affiche la donnée voulu sinon affiche tout les endpoints
		},

		{
			name: "controlEndpoint",
			categorie: "Command",
			value: "COMMAND_TEMPERATURE" //si string affiche la donnée voulu sinon affiche tout les endpoints
		},
		{
			name: "controlEndpoint",
			categorie: "Occupation",
			// value: "Présence" //si string affiche la donnée voulu sinon affiche tout les endpoints
		},
		{
			name: "controlEndpoint",
			categorie: "Multicapteurs",
			value: null //si string affiche la donnée voulu sinon affiche tout les endpoints
		},
		// {
		// 	name: "app",
		// 	value: "Ticket",
		// 	id: "eyJuYW1lIjoic3BpbmFsLWVudi1wYW0tdGlja2V0cyIsInR5cGUiOiJCdWlsZGluZ0FwcCIsImlkIjoiZWI0ZC1hM2MxLWVmMTEtMThmMjBkZGM5YzciLCJkaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzE0MjQzMzcyMzcxLCJpbmRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3MTQyNDMzNTcxMjcsImljb24iOiJtZGktdGlja2V0LWFjY291bnQiLCJkZXNjcmlwdGlvbiI6IiIsInRhZ3MiOlsidGlja2V0Il0sImNhdGVnb3J5TmFtZSI6IiIsImdyb3VwTmFtZSI6IiIsImhhc1ZpZXdlciI6ZmFsc2UsInBhY2thZ2VOYW1lIjoic3BpbmFsLWVudi1wYW0tdGlja2V0cyIsImlzRXh0ZXJuYWxBcHAiOmZhbHNlLCJsaW5rIjoiIiwicmVmZXJlbmNlcyI6e30sInBhcmVudCI6eyJwb3J0b2ZvbGlvSWQiOiIzN2RlLTAyYjgtZTE4Yi0xODUwNjQzYjY4YSIsImJ1aWxkaW5nSWQiOiI1OTMyLTYwODYtOWUxYS0xODUwNjQ3ODQ2MCJ9fQ",
		// },
		// {
		// 	name: "app",
		// 	value: "Insight",
		// 	id: "eyJuYW1lIjoiSW5zaWdodHMiLCJ0eXBlIjoiQnVpbGRpbmdBcHAiLCJpZCI6ImIwZTEtNzI3NS02YWNhLTE4ZjJlMjE1NmE4IiwiZGlyZWN0TW9kaWZpY2F0aW9uRGF0ZSI6MTcxNDQ2NTk0NzM4MCwiaW5kaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzE0NDY1ODg3OTEyLCJpY29uIjoibWRpLWN1cnRhaW5zLWNsb3NlZCIsImRlc2NyaXB0aW9uIjoiSU5zaWdodHMiLCJ0YWdzIjpbIkluc2lnaHRzIl0sImNhdGVnb3J5TmFtZSI6IiIsImdyb3VwTmFtZSI6IiIsImhhc1ZpZXdlciI6ZmFsc2UsInBhY2thZ2VOYW1lIjoic3BpbmFsLWVudi1wYW0taW5zaWdodHMiLCJpc0V4dGVybmFsQXBwIjpmYWxzZSwibGluayI6IiIsInJlZmVyZW5jZXMiOnt9LCJwYXJlbnQiOnsicG9ydG9mb2xpb0lkIjoiMzdkZS0wMmI4LWUxOGItMTg1MDY0M2I2OGEiLCJidWlsZGluZ0lkIjoiNTkzMi02MDg2LTllMWEtMTg1MDY0Nzg0NjAifX0",
		// }

	]


};