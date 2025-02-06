import { ITemporality } from "../../interfaces/IConfig";
import moment from "moment";

/***
 * @function getLabels
 * @param temporality {ITemporality}
 * @param index {number}
 * @returns {Array<number>}
 * @description renvoie un tableau de timestamp à intervalle régulier de 5 minutes
 * @example getLabels("four", -2)
 * @summary getLabels
 * @typedef {Array} getLabels
 */
export function getLabels(temporality: any, index: number = 0) {
  let begin;
  switch (temporality.name) {
    case ITemporality.hour:
      begin = moment().startOf("hour").add(index, "hours");
      // return Array(12 )
      return Array( 60 )
        .fill(0)
        .map((_, i) =>
          moment(begin)
            .add(i, "minutes")
            .valueOf()
        );
    case ITemporality.day:
      begin = moment().startOf("day").add(index, "days");
      return Array(60 * 24)
        .fill(0)
        .map((_, i) =>
          moment(begin)
            .add(i, "minutes")
            .valueOf()
        );
    case ITemporality.week:
      begin = moment().startOf("week").add(index, "weeks");
      return Array(60 * 24 * 7)
        .fill(0)
        .map((_, i) =>
          moment(begin)
            .add(i, "minutes")
            .valueOf()
        );
    case ITemporality.month:
      begin = moment().startOf("month").add(index, "months");
      return Array(60 * 24 * begin.daysInMonth())
        .fill(0)
        .map((_, i) =>
          moment(begin)
            .add(i, "minutes")
            .valueOf()
        );
    case ITemporality.year:
      begin = moment().startOf("year").add(index, "years");
      return Array(60 * 24 * moment().endOf("year").dayOfYear())
        .fill(0)
        .map((_, i) =>
          moment(begin)
            .add(i, "minutes")
            .valueOf()
        );
    case ITemporality.custom:
      console.log("temporality", temporality);
      const start = moment(temporality.range.begin, "DD-MM-YYYY HH:mm")
        .startOf("minute")
        .valueOf();
      const end = moment(temporality.range.end, "DD-MM-YYYY HH:mm").valueOf();
      const ret = <number[]>[];
      for (let i = start; i < end; i += 60000) {
        ret.push(i);
      }
      return ret;
    default:
      return [];
  }
}

/***
 * @function getValues
 * @param series {Array<{date: number, value: number}>}
 * @returns {Object}
 * @description renvoie un objet avec les valeurs des séries sous la forme {
 * timestamp1: value1,
 * timestamp2: value2,
 * ...}
 * @example getValues([{date: 1620000000000, value: 10}, {date: 1620000000000, value: 20}])
 * @summary getValues
 * @typedef {Object} getValues
 */
export function getValues(series: any[]) {
  const ret = {};
  if(!series) return ret;
  series.forEach((s) => {
    const x = moment(s.date).seconds(0).milliseconds(0).valueOf();
    ret[x] = s.value;
  });
  return ret;
}

export function preProcessData(data, timestamps){

}
