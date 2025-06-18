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

import { ActionTypes } from "./vuexStoreTypes";

// export interface IConfig {
//   context: string;
//   category: string;
//   groupEquipement: string;
//   profileName: string;
//   attributs: IAttribute;
//   sources: ISource[];
// }

export interface IConfig {
  entryPoint?: EntryPoint;
  sources: ISource[];
  bilan : {
    timeline: Istatistique,
    dotsGrid?: Istatistique

  }
}

export interface IGroup{
  dynamicId: number;
  staticId: string;
  name: string;
}


export interface IAttribute {
  categoryAttribute: string;
  label: string;
  conventionName: RegExp;
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

export interface IRegroupement {
  context: string;
  category: string;
}

export type EntryPoint = { context: string; group?: string []; category?: string; type: 'equipement' | 'room' };

export const enum calculTypes {
  Maximum = "Maximum",
  Minimum = "Minimum",
  Moyenne = "Moyenne",
  Somme = "Somme",
  MoyennePercent = "Moyenne en Pourcentage",
  MeanTime = "Moyenne temporelle",
}

export interface ISource {
  id: number,
  type: string,
  categoryName?: string,
  name: string,
  unit: string,
  profileName?: string,
  legend?: ILegend,
}


// export interface ISource {
//   name: string;
//   unit: string;
// }



interface Istatistique {
  sourceId: number;
  setup : {
    type: string | 'regex';
    value: string | number ;
    legend?: ILegendStatistique[];
  }
}


interface ILegendStatistique {
  name: string;
  color: string;
  label?: string;
  type: string;
  
}
interface IValue {
  min?: number;
  max?: number;
  value?: number;
}

interface ILegendValue { 
  value: number;
  color: string;
}
interface ILegend {
  min: ILegendValue;
  median?: ILegendValue;
  max: ILegendValue;
}

// export interface IButton {
//   title: string;
//   icon: string;
//   isShownTypes?: string[];
//   onclickEvent?: ActionTypes;
// }
