// import { HTTP.HTTP } from "./http.HTTP-constants";

import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)

import moment from 'moment';
import fr from 'moment/locale/fr';

export async function getBuilding() {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(`building/read`);
  return result.data;
}

export async function getFloors() {
  const buildingId = localStorage.getItem('idBuilding');
  const result = await HTTP.get(`floor/list`);
  return result.data;
}

export async function getData(space, tempo, currentTimestamp, controlEndpoints) {
  // var calendar = generateMonthlyData('2023');
  var calendar = [];
  var calendarObject;
  const buildingId = localStorage.getItem("idBuilding");
  let avg = [], total = [];
  let periodArray = getPeriodArray(currentTimestamp, tempo);
  let label = periodArray[0];
  let tooltipDate = periodArray[5];
  let data = [];
  let cpList, cpID, timeSeries, prevTimeSeries, prevSumSeries, sumSeries, prevTotRoot, prevAvgRoot;
  try {
  for (const controlEndpoint of controlEndpoints) {
    cpList = await HTTP.get(`node/${space.dynamicId}/control_endpoint_list`);
    // Recherche le dynamicId du bon cp parmis la réponse api
    for (let j = 0; j < cpList.data.length; j++) {
      for (let i = 0; i < cpList.data[j].endpoints.length; i++) {
        if (cpList.data[j].endpoints[i].name === controlEndpoint.name) {
          cpID = cpList.data[j].endpoints[i].dynamicId;
        }
      }
    }
    
    // si le cpID est trouvé, on récupère les données timeseries
    if (cpID) {
    timeSeries = await HTTP.get(`endpoint/${cpID}/timeSeries/read/${periodArray[1]}/${periodArray[2]}`);
    timeSeries = timeSeries.data;
    if(timeSeries.length == 0 ) continue;

    // prepareCalendar(timeSeries, currentTimestamp, controlEndpoint.name);
    // prevTimeSeries = await HTTP.HTTP.get(`/endpoint/${cpID}/timeSeries/read/${periodArray[3]}/${periodArray[4]}`);
    // prevTimeSeries = prevTimeSeries.data;

    
    let processedTimeSeries = [];
    if (tempo === 'Semaine') {
      label.forEach(day => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });

    } else if (tempo === 'Mois') {
      label.forEach(day => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    } else if (tempo === 'Année') {
      calendarObject = {}
      calendarObject.y = moment(currentTimestamp).format('YYYY');
      calendarObject.n = controlEndpoint.name;
      calendarObject.d = prepareCalendar(calendarObject.y, timeSeries);
      calendarObject.max = controlEndpoint.max;
      calendarObject.min = controlEndpoint.min;
      calendar.push(calendarObject);
      label.forEach(month => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('MMM') === month)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    } else if (tempo === 'Décennie') {
      label.forEach(year => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('YYYY') === year)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    } else if (tempo === '3 mois') {
      label.forEach(day => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    } else {
      processedTimeSeries = timeSeries;
    }

    sumSeries = timeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
    if (controlEndpoint.root == true) {
      prevTotRoot = sumSeries;
    }
    // prevSumSeries = prevTimeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
    let a = (sumSeries * 100 / prevTotRoot).toFixed(1);
    if (controlEndpoint.root == true) {
      total.push({
        color: controlEndpoint.color,
        value: sumSeries,
        unit: controlEndpoint.unit,
        title: controlEndpoint.totalTitle,
        subValue: '100%',
        subtitle: controlEndpoint.totalSubtitle,
        root: controlEndpoint.root,
        cpID: cpID,
        startDate: periodArray[3],
        endDate: periodArray[4],
        label: label.length,
      })
    }
    else
      total.push({
        color: controlEndpoint.color,
        value: sumSeries,
        unit: controlEndpoint.unit,
        title: controlEndpoint.totalTitle,
        subValue: a + '%',
        subtitle: controlEndpoint.totalSubtitle,
        root: controlEndpoint.root,
        cpID: cpID,
        startDate: periodArray[3],
        endDate: periodArray[4],
        label: label.length,
      })
      sumSeries = sumSeries / label.length;
      if (controlEndpoint.root == true) {
        prevAvgRoot = sumSeries;
      }
      let b = (sumSeries * 100 / prevAvgRoot).toFixed(1);
      if (controlEndpoint.root == true) {
        avg.push({
          color: controlEndpoint.color,
          value: sumSeries,
          unit: controlEndpoint.unit,
          title: controlEndpoint.averageTitle,
          subValue: '100%',
          subtitle: controlEndpoint.averageSubtitle,
          root: controlEndpoint.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }
      else {
        avg.push({
          color: controlEndpoint.color,
          value: sumSeries,
          unit: controlEndpoint.unit,
          title: controlEndpoint.averageTitle,
          subValue: b + '%',
          subtitle: controlEndpoint.averageSubtitle,
          root: controlEndpoint.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }
    data.push({
      label: controlEndpoint.label,
      backgroundColor: controlEndpoint.color,
      data: processedTimeSeries,
      stack: controlEndpoint.stackGroup,
      tooltipDate: tooltipDate
    })
    cpID = null;
    }    
  }
}
catch {
  return undefined;
}
  if(data.length == 0) { return undefined; }
  return [label, data, avg, total, calendar];
}

function getPeriodArray(timestamp, period) {
  if (period === 'Semaine') {
    var startOfWeek = moment(timestamp).startOf('week');
    var endOfWeek = moment(timestamp).endOf('week');
    var daysInMonth = [];
    var tooltipDate = [];
    var currentDay = moment(startOfWeek);
    while (currentDay.isSameOrBefore(endOfWeek)) {
      daysInMonth.push(currentDay.format('DD MMM'));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    return [daysInMonth,
      moment(timestamp).startOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'weeks').startOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'weeks').endOf('week').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate
    ];
  } else if (period === 'Mois') {
    var startOfMonth = moment(timestamp).startOf('month');
    var endOfMonth = moment(timestamp).endOf('month');
    var daysInMonth = [];
    var tooltipDate = [];
    var currentDay = moment(startOfMonth);
    while (currentDay.isSameOrBefore(endOfMonth)) {
      daysInMonth.push(currentDay.format('DD MMM'));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    return [daysInMonth,
      moment(timestamp).startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'months').startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'months').endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate
    ];
  } else if (period === 'Année') {
    var monthsInYear = [];
    var tooltipDate = [];
    for (var i = 0; i < 12; i++) {
      var currentMonth = moment(timestamp).month(i);
      monthsInYear.push(currentMonth.format('MMM'));
      tooltipDate.push(moment(currentMonth).format('MMMM/YYYY').slice(0, 1).toUpperCase() + moment(currentMonth).format('MMMM/YYYY').slice(1));
    }
    return [monthsInYear,
      moment(timestamp).startOf('year').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('year').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'years').startOf('year').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'years').endOf('year').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate
    ];
  } else if (period === 'Décennie') {
    var yearsInDecade = [];
    var tooltipDate = [];
    for (var i = -9; i <= 0; i++) {
      var currentYear = moment(timestamp).add(i, 'years');
      yearsInDecade.push(currentYear.format('YYYY'));
      tooltipDate.push(moment(currentYear).format('YYYY').slice(0, 1).toUpperCase() + moment(currentYear).format('YYYY').slice(1));
    }
    return [yearsInDecade,
      moment(timestamp).add(-10, 'years').startOf('year').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('year').format('DD-MM-yyyy HH:mm:ss'), '', '', tooltipDate];
  } else if (period === '3 mois') {
    var startOfMonth = moment(timestamp).add(-2, 'months').startOf('month');
    var endOfMonth = moment(timestamp).endOf('month');
    var daysIn3Months = [];
    var tooltipDate = [];
    var currentDay = moment(startOfMonth);
    while (currentDay.isSameOrBefore(endOfMonth)) {
      daysIn3Months.push(currentDay.format('DD MMM'));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    return [daysIn3Months, moment(timestamp).add(-2, 'months').startOf('month').format('DD-MM-yyyy HH:mm:ss'), moment(timestamp).endOf('month').format('DD-MM-yyyy HH:mm:ss'), tooltipDate];
  } else {
    return [];
  }
}

export async function getTodaysData(space, controlEndpoints) {
  // var data = [
  //   {
  //     label: 'Energie globale',
  //     name: 'Energie globale',
  //     color: '#14202c',
  //     unit: 'Kw',
  //     title: 'title',
  //     subtitle: 'sub',
  //     root: true,
  //   }
  // ]
  const data = [];
  const buildingId = localStorage.getItem("idBuilding");
  // var startOfDay = moment().startOf('day').format('DD-MM-yyyy HH:mm:ss');
  // var endOfDay = moment().endOf('day').format('DD-MM-yyyy HH:mm:ss');
  var startOfDay = moment().startOf('day').add(1, 'hours').format('DD-MM-yyyy HH:mm:ss');
  var endOfDay = moment().startOf('day').add(1,'day').format('DD-MM-yyyy HH:mm:ss');
  // console.log(startOfDay, endOfDay);
  let cpList, cpID, timeSeries, sumSeries, sub;
  for (const controlEndpoint of controlEndpoints) {
    cpList = await HTTP.get(`node/${space.dynamicId}/control_endpoint_list`);
    // console.log(cpList.data);
    // cpList = cpList.data[1].endpoints;
    // for (let i = 0; i < cpList.length; i++) {
    //   if (cpList[i].name === controlEndpoint.name) {
    //     cpID = cpList[i].dynamicId;
    //   }
    // }

    for (let j = 0; j < cpList.data.length; j++) {
      for (let i = 0; i < cpList.data[j].endpoints.length; i++) {
        if (cpList.data[j].endpoints[i].name === controlEndpoint.name) {
          cpID = cpList.data[j].endpoints[i].dynamicId;
          // console.log(cpID)
        }
      }
    }
    if (cpID) {
    timeSeries = await HTTP.get(`endpoint/${cpID}/timeSeries/read/${startOfDay}/${endOfDay}`);
    // timeSeries = await HTTP.HTTP.get(`/endpoint/${cpID}/timeSeries/read/07-02-2023 00:00:00/07-02-2023 23:59:59`);
    timeSeries = timeSeries.data;
    sumSeries = timeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
    data.push({
      color: controlEndpoint.color,
      value: sumSeries,
      unit: controlEndpoint.unit,
      title: controlEndpoint.title,
      subValue: '+0%',
      subtitle: controlEndpoint.subtitle,
      root: controlEndpoint.root
    })
    cpID = null;
  }
  }
  let sum = data[0].value;
  for (let i = 1; i < data.length; i++) {
    if (data[i].unit !== data[i-1].unit) {
      sum = data[i].value;
      data[i].subtitle = null;
      data[i].subValue = null

    }
    else {
      data[i].subValue = (data[i].value * 100 / sum).toFixed(1) + '%';
    }
  }
  return data;
}


function generateMonthlyData(y) {
  const monthlyData = [];
  const test = 1;
  const date = moment(y, 'YYYY');
  // loop through 12 months
  for (let i = 0; i < 12; i++) {
    let daysInMonth = date.month(i).daysInMonth();
    if (i === 1) { // February
      if (moment([y]).isLeapYear()) {
        daysInMonth = 29;
      }
    }
    const monthArray = Array(daysInMonth).fill(-1);
    monthlyData.push(monthArray);
  }
// console.log({
//   y: year,
//   d: monthlyData
// })
  if (test == 1)
  return {
    n: '',
    y: y,
    d: monthlyData
  };

  return {
    n: '',
    y: y,
    d: [
      [
        182, 400, 200, 201, 201, 170,
        187, 282, 258, 171, 275, 183,
        267, 294, 288, 194, 258, 228,
        204, 236, 244, 172, 274, 290,
        206, 274, 293, 185, 261, 247,
        210
      ] ,
      [
        225, 140, 139, 166, 179, 205,
        159, 134, 210, 137, 163, 227,
        185, 197, 174, 226, 215, 147,
        144, 216, 145, 206, 206, 159,
        223, 169, 206, 207
      ] ,
      [
        125, 156,  92, 120, 131, 113, 157,
        133, 155, 134, 153, 137, 114, 127,
        110, 113, 146, 107, 120, 169, 142,
        146, 167, 165, 125, 144, 119, 153,
        123, 144,  95
      ] ,
      [
        101,  91, 139, 154, 100, 127, 157,
        90, 141, 119, 146, 102, 137, 125,
        118, 146,  96, 117, 106, 165, 102,
        118,  94, 140,  95, 131,  93, 163,
        92, 102
      ] ,
      [
        86, 104, 126, 139, 116, 168, 109,
        56, 132, 113,  55, 150, 109, 123,
        64,  85, 129, 100,  67,  91, 137,
        104, 157,  96, 141, 163,  89,  53,
        119, 126, 130
      ] ,
      [
        81, 32, 23,  15, 116, 57, 21, 73,  0,
        77, 84, 76, 101, 116, 30, 79, 81, 59,
        25, 24, 47,   3,  20, 35, 39, 29, 80,
        64, 83, 98
      ] ,
      [
        129,   1, 63, 28, 50, 106,  3, 104, 21,
        34, 105, 48, 93,  0,  80, 36,  25, 48,
        95,  23, 98, 25, 78,  56, 71,  40, 43,
        86, 109, 34, 86
      ] ,
      [
        32, 59, 56, 23, 94, 20, 38, 83, 41,
        81, 64, 52, 84, 99, 97, 40, 46, 22,
        98, 31, 94, 13, 30, 30, 37,  9, 62,
        9,  6, 18, 16
      ] ,
      [
        96, 17, 27, 94, 11, 58, 63, 34, 39,
        74, 52, 82, 96, 80, 39,  7, 41, 32,
        43, 89, 75, 80, 67, 70, 69, 63, 77,
        23, 68, 12
      ] ,
      [
        128, 124, 144,  87, 128, 132, 168,
        129, 154, 158, 150,  79, 138, 101,
        123,  74, 167, 160,  86, 162, 162,
        116,  72, 160, 108,  71,  81, 112,
        127,  74,  78
      ] ,
      [
        252, 259, 193, 263, 285, 204,
        232, 210, 224, 196, 198, 282,
        240, 282, 193, 289, 245, 255,
        178, 225, 248, 297, 228, 234,
        280, 197, 207, 203, 282, 237
      ] ,
      [
      280, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
      ] ,
    ],
  }
}

function prepareCalendar(year, timeSeries) {
  var data = generateMonthlyData(year).d;
  var month, day;
  for (const timeSerie of timeSeries) {
    month = +moment(timeSerie.date).format('MM') - 1;
    day = +moment(timeSerie.date).format('DD') - 1;
    data[month][day] = (data[month][day] == -1) ? timeSerie.value : data[month][day] + timeSerie.value;
  }
  return data;
}
// export async function getAverageAndTotalData(avg, total) {
//   const buildingId = localStorage.getItem("idBuilding");
//   let timeSeries, sumSeries;
//   console.log(avg);
//   for (let i = 0; i < total.lenght; i++) {
//     timeSeries = await HTTP.HTTP.get(`/endpoint/${total[i].cpID}/timeSeries/read/${total[i].startDate}/${total[i].endDate}`);
//     timeSeries = timeSeries.data;
//     sumSeries = timeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
//     total[i].subValue = sumSeries;
//     total[i].subtitle = 'sumSeries';
//     sumSeries = sumSeries / total[i].label;
//     avg[i].subValue = sumSeries;
//     avg[i].subtitle = 'sumSeries';
//     console.log(avg[i])
//   }
//   return [avg, total];
// }

