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
import moment, { min } from "moment";
import { calculTypes } from "../../interfaces/IConfig";
import { INodeItemTree } from "../../interfaces/INodeItem";
import { getTimeSeriesAsync } from "../spinalAPI/endpoints/getEndpoints";

export async function calculItemsValue(
  data: INodeItemTree[],
  calculMode: calculTypes,
  time?: any,
  min?: number,
  max?: number
): Promise<INodeItemTree[]> {
  return await Promise.all(
    data.flatMap(async (item) => {
      const values = await Promise.all(
        item.children.map(
          async (el) => await getValue(el, calculMode, time, min, max)
        )
      );
      const value = calculateTotal(values, calculMode);

      item.displayValue = isFinite(value) ? value : "-";
      return item;
    })
  );
}

export function getColor(item, legend, percent = false) {
  const value = item.displayValue;

  if (isNaN(value) || !isFinite(value)) return "#808080";

  const { min, max } = percent
    ? { min: 0, max: 100 }
    : { min: legend.min.value, max: legend.max.value };

  if (legend.median) {
    const third = min + (max - min) / 3;
    const two_third = min + ((max - min) * 2) / 3;

    if (value <= third) return legend.min.color;
    if (value <= two_third) return legend.median.color;
    return legend.max.color;
  }

  const mid = (min + max) / 2;
  return value <= mid ? legend.min.color : legend.max.color;
}

async function getValue(
  item: INodeItemTree,
  calculMode: calculTypes,
  time?: any,
  min?: number,
  max?: number
) {
  let values;
  if (!time) {
    values = [item.endpoint?.value] || [item.endpoint?.currentValue] || [];
  } else {
    const buildingId = localStorage.getItem("idBuilding") || "";
    const series = item.endpoint
      ? await getTimeSeriesAsync(
          buildingId,
          item.endpoint?.dynamicId,
          time.begin,
          time.end
        )
      : [];
    item.series = series;
    if (calculMode === calculTypes.MeanTime) {
      const { begin, end } = series.length
        ? {
            begin: series[0].date,
            end: series[series.length - 1].date,
          }
        : { begin: moment(time.begin), end: moment(time.end) };
      values = series.map((el, ind, arr) =>
        ind < arr.length - 1
          ? el.value * (arr[ind + 1].date - el.date)
          : el.value *
            (moment(el.date).hour(23).minutes(59).second(59).valueOf() -
              el.date)
      );
      item.displayValue = getSum(values) / (end.valueOf() - begin.valueOf());
      return item.displayValue;
    } else values = series.map((el) => el.value);
  }
  item.displayValue = calculateValue(values, calculMode, min, max);
  return item.displayValue;
}

export function calculateValue(
  arr: (string | number)[],
  calculMode: calculTypes,
  min: number = 0,
  max: number = 100
): number {
  if (!arr.length) return NaN;
  const nums = _filterAndconvertDataToNumber(arr);
  if (!nums.length) return NaN;

  switch (calculMode) {
    case calculTypes.Maximum:
      return getMax(nums);
    case calculTypes.Minimum:
      return getMin(nums);
    case calculTypes.Somme:
      return getSum(nums);
    case calculTypes.Moyenne:
      return getMoyenne(nums);
    case calculTypes.MoyennePercent:
      const moy = getMoyenne(nums);
      return ((moy - min) / (max - min)) * 100;
  }
}

export function calculateTotal(
  arr: (string | number)[],
  calculMode: calculTypes
): number {
  const nums = _filterAndconvertDataToNumber(arr);

  switch (calculMode) {
    case calculTypes.Maximum:
      return getMax(nums);
    case calculTypes.Minimum:
      return getMin(nums);
    case calculTypes.Somme:
      return getSum(nums);
    case calculTypes.Moyenne:
    case calculTypes.MoyennePercent:
    case calculTypes.MeanTime:
      return getMoyenne(nums);
  }
}

function getMax(arr: number[]) {
  return Math.max(...arr);
}

function getMin(arr: number[]) {
  return Math.min(...arr);
}

function getSum(arr: number[]) {
  return arr.reduce((sum, i) => {
    sum += i;
    return sum;
  }, 0);
}

function getMoyenne(arr: number[]) {
  const sum = getSum(arr);
  return sum / arr.length;
}

function _filterAndconvertDataToNumber(arr: (string | number)[]): number[] {
  return arr.reduce((list, i) => {
    //@ts-ignore
    if (!isNaN(i as any)) list.push(Number(i as any));
    return list;
  }, []);
}
