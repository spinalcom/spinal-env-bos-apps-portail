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

import { IConfig, ITemporality, calculTypes } from "./interfaces/IConfig";

export const config: IConfig = {
  viewButtons: "base",
  // entryPoint: { context: "Gestion des équipements", category: "Typologie", group: "CVC" },
  // source: [{
  // 	name: "Maintenance CVC",
  // 	profileName: "Control point",
  // 	type: "controlPoint",
  // 	objectType: "equipments",
  // 	unit: "",
  //   legend: {
  //           min: { value: 0, color: "#24CBD9" },
  //           median: { value: 50, color: "#2077CE" },
  //           max: { value: 100, color: "#112C9D" },
  //         },
  // }],
  // regroupement: [
  //     {
  //       context: "Gestion des équipements",
  //       category: "Typologie"
  //     }
  //   ],



  // Config DEI
  entryPoint: {
    context: "Gestion des espaces",
    category: "Typologie",
    group: "Bureaux",
  },
  source: [
    {
      name: "Taux d'occupation",
      profileName: "Occupation",
      type: "controlPoint",
      objectType: "rooms",
      unit: "%",
      legend: {
        min: { value: 0, color: "#24CBD9" },
        median: { value: 50, color: "#2077CE" },
        max: { value: 100, color: "#112C9D" },
      },
    },
    {
      name: "Présence",
      profileName: "Occupation",
      type: "controlPoint",
      objectType: "rooms",
      unit: "",
      legend: {
        min: { value: 0, color: "#00FF00" },
        median: { value: 0.5, color: "#FFFF00" },
        max: { value: 1, color: "#FF0000" },
      },
    },
    {
      name: "Nombre de personnes",
      profileName: "Occupation",
      type: "controlPoint",
      objectType: "rooms",
      unit: "",
      legend: {
        min: { value: 0, color: "#00FF00" },
        median: { value: 10, color: "#FFFF00" },
        max: { value: 20, color: "#FF0000" },
      },
    }
  ],
  regroupement: [
    {
      context: "Gestion des espaces",
      category: "Typologie"
    },
    {	
      context: "Gestion des espaces",
      category: "Affectation par entreprise"
    },
    {
      context: "Gestion des espaces",
      category: "Gestion des locations"
    },
    {
      context: "Gestion des espaces",
      category: "Affectation par service"
    }
  ],






  // FIN Config DEI





  title: "Insights sur les multicapteurs",
  calculs: [
    calculTypes.Maximum,
    calculTypes.Minimum,
    calculTypes.Moyenne,
    calculTypes.Somme,
    calculTypes.MoyennePercent,
    calculTypes.MeanTime,
  ],
  //sprites: true,
  viewerInfo: { roomRef: true, floorRef: true, equipments: "all" },
  temporality: [
    ITemporality.currentValue,
    ITemporality.hour,
    ITemporality.day,
    ITemporality.week,
    ITemporality.month,
    ITemporality.year,
    ITemporality.custom,
  ],
};

// export const config: IConfig = {
//    viewButtons: "base",
//    title: "Le titre de mon app",
//    calculs : [calculTypes.Maximum, calculTypes.Minimum, calculTypes.Moyenne, calculTypes.Somme],
//    sprites: true,
//    legend: {
//       min: { value: 15, color: "#0074FF" },
//       median: { value: 27.5, color: "#FFFF00" },
//       max: {value: 40, color: "#FF004B"}
//    },
// 	  temporality: [ITemporality.currentValue, ITemporality.day, ITemporality.week, ITemporality.month, ITemporality.year],

//    //////////////////////////////
//    source: { name: "Température", profileName: "Multicapteurs", type: "controlPoint", objectType: "equipments", unit : "°C" },
//    entryPoint: { context : "Gestion des équipements", category : "Typologie", group: "Multicapteurs" },
//    regroupement: { context: "Gestion des équipements", category: "Typologie" },
//    viewerInfo: {roomRef: true, floorRef: true, equipments: "none"},

//    // source: { name: "Température", profileName: "Control Point", type: "controlPoint", objectType: "equipments", unit : "°C" },
//    // entryPoint: { context : "Gestion des espaces", category : "Typologie", group: "Bureaux" },
//    // regroupement: {context: "Gestion des espaces", category : "Affectation par service"}

// }
