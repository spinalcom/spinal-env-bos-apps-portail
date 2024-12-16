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
	sprites: false,
	viewerInfo: { roomRef: true, floorRef: true, equipments: "all" },
	temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],

	idAppDescription : "eyJuYW1lIjoiZGVzY192MiIsInR5cGUiOiJCdWlsZGluZ0FwcCIsImlkIjoiOTQ1MC1hNzI4LWM2Y2QtMTkzYWFmNjNjZmYiLCJkaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzMzNzQwMTAxOTIwLCJpbmRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3MzM3NDAwODQ0NzksImljb24iOiIiLCJkZXNjcmlwdGlvbiI6IiIsInRhZ3MiOltdLCJjYXRlZ29yeU5hbWUiOiIiLCJncm91cE5hbWUiOiIiLCJoYXNWaWV3ZXIiOmZhbHNlLCJwYWNrYWdlTmFtZSI6InNwaW5hbC1hcHAtdmlld2VyLWRlc2NyaXB0aW9uX3YyIiwiaXNFeHRlcm5hbEFwcCI6ZmFsc2UsImxpbmsiOiIiLCJkb2N1bWVudGF0aW9uTGluayI6IiIsInJlZmVyZW5jZXMiOnt9LCJwYXJlbnQiOnsicG9ydG9mb2xpb0lkIjoiMzdkZS0wMmI4LWUxOGItMTg1MDY0M2I2OGEiLCJidWlsZGluZ0lkIjoiNTkzMi02MDg2LTllMWEtMTg1MDY0Nzg0NjAifX0",

	//DATASIDE vue globale
	//catégorie d'inventaire cliblé
	inventory: "Mobilier",


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
			name: "Voir les données Insight",
			id: "eyJuYW1lIjoiSW5zaWdodCIsInR5cGUiOiJCdWlsZGluZ0FwcCIsImlkIjoiZTJmMS0zMTAzLTRkMjEtMTkzMGI5M2Y0NDYiLCJkaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzMxMDY2NzkxMDk4LCJpbmRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3MzEwNjYwNjU5OTAsImljb24iOiJtZGktYmxhY2stbWVzYSIsImRlc2NyaXB0aW9uIjoiIiwidGFncyI6WyJWSUVXRVIiXSwiY2F0ZWdvcnlOYW1lIjoiIiwiZ3JvdXBOYW1lIjoiIiwiaGFzVmlld2VyIjpmYWxzZSwicGFja2FnZU5hbWUiOiJzcGluYWwtYXBwLXZpZXdlci1pbnNpZ2h0IiwiaXNFeHRlcm5hbEFwcCI6ZmFsc2UsImxpbmsiOiIiLCJkb2N1bWVudGF0aW9uTGluayI6IiIsInJlZmVyZW5jZXMiOnt9LCJwYXJlbnQiOnsicG9ydG9mb2xpb0lkIjoiMzdkZS0wMmI4LWUxOGItMTg1MDY0M2I2OGEiLCJidWlsZGluZ0lkIjoiNTkzMi02MDg2LTllMWEtMTg1MDY0Nzg0NjAifX0",
			profileName: "KPI USI",
			type: "controlEndpoint",
			unit: "nbr de ctrlpts"
		},
		{
			name: "Voir les tickets du bâtiment",
			id: "eyJuYW1lIjoiVGlja2V0cyIsInR5cGUiOiJCdWlsZGluZ0FwcCIsImlkIjoiZTRkNS0yZGFkLTI0NjUtMTkzMGI5NzczNmQiLCJkaXJlY3RNb2RpZmljYXRpb25EYXRlIjoxNzMxMDY2NzkxMDk4LCJpbmRpcmVjdE1vZGlmaWNhdGlvbkRhdGUiOjE3MzEwNjYyOTUxNDksImljb24iOiJtZGktYmxhY2stbWVzYSIsImRlc2NyaXB0aW9uIjoiIiwidGFncyI6WyJWSUVXRVIiXSwiY2F0ZWdvcnlOYW1lIjoiIiwiZ3JvdXBOYW1lIjoiIiwiaGFzVmlld2VyIjpmYWxzZSwicGFja2FnZU5hbWUiOiJzcGluYWwtYXBwLXZpZXdlci10aWNrZXRzIiwiaXNFeHRlcm5hbEFwcCI6ZmFsc2UsImxpbmsiOiIiLCJkb2N1bWVudGF0aW9uTGluayI6IiIsInJlZmVyZW5jZXMiOnt9LCJwYXJlbnQiOnsicG9ydG9mb2xpb0lkIjoiMzdkZS0wMmI4LWUxOGItMTg1MDY0M2I2OGEiLCJidWlsZGluZ0lkIjoiNTkzMi02MDg2LTllMWEtMTg1MDY0Nzg0NjAifX0",
			type: "tickets",
			unit: "nbr de ticket"
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