/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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

import type {
  IEquipmentItem,
  IZoneItem,
} from "../../../../../../global-components/SpaceSelector";
import type { IViewInfoItemRes } from "../../spinalAPI/GeographicContext/getViewInfo";
import type { IGetAllBuildingsRes } from "../../../interfaces/IGetAllBuildingsRes";
import {ILoading} from "../../../interfaces/ILoading"
import {
  defaultTemporalitySelected,
  defaultZoneSelected,
} from "./utils/defaultZoneSelected";
import { subscribe } from "diagnostics_channel";
import { Socket } from "engine.io-client";
import { isError } from "util";

export type StateAppData = typeof state;
export const state = {
  buildings: [] as IGetAllBuildingsRes[],
  zoneSelected: defaultZoneSelected(),
  temporalitySelected: defaultTemporalitySelected(),
  t_index: 0 as number,
  floors: {} as Record<string, IZoneItem[]>,
  rooms: {} as Record<number, IZoneItem[]>,
  roomBimObj: {} as Record<number, IEquipmentItem[]>,
  buildingInfo: {} as Record<number, IViewInfoItemRes[]>,
  viewerStartedList: {} as { [key: string]: string },
  itemSelected: undefined,
  selectedChartItems: [] as any[],
  selectedSource: {},
  StripeDataList: [] as any[],
  DotsGridList: [] as any[],  
  data: [] as any[],
  context: {} as any,
  categoriesContext: {} as any,
  groupEquipement: [] as any,
  SourceList: [] as any[],
  filterDataConfig: [] as any[],
  appConfig: {} as any,
  //Loader compo
  progressLoader: {
    message: '',
    total: 0,
    completed: 0,
    percent: 0,
    isError : null,
    isSuccess: null,
    logs: [] as any[],
  } as ILoading,
   Loading: false,


  // FilerData 
  filterData : [] as any[],

  ValueRegex: {
    regex: "",
    column: [] as string[],
  },


  valueFilters: [] as any[],

  configLabel: [] as any[],
  DownloadData: [] as any[],
  // CancelFilterOn Stripe Component
  cancelFilter: false,
};
