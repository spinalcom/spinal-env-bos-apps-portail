
import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
import moment from 'moment';
import fr from 'moment/locale/fr';
import blank from './blank';

export async function getBuilding(source) {
  const buildingId = localStorage.getItem("idBuilding");
  const result = await HTTP.get(`building/read`);
  result.data.source = [];
  const type = new Set(source.map(item => item.type)).size === 1 ? source[0].type : 'both';
  let cpList, pList;
  if (type !== 'endpoint') cpList = await HTTP.get(`node/${result.data.dynamicId}/control_endpoint_list`);
  if (type !== 'controlEndpoint') pList = await HTTP.get(`node/${result.data.dynamicId}/endpoint_list`);
  for (const s of source) {
    if (s.type === 'controlEndpoint' && cpList.data.find(e => e.profileName === s.profile) && cpList.data[cpList.data.findIndex(e => e.profileName === s.profile)].endpoints.find(e => e.name === s.name)) {
      result.data.source.push({...s, dynamicId: cpList.data[cpList.data.findIndex(e => e.profileName === s.profile)].endpoints.find(e => e.name === s.name).dynamicId});
    }
  }
  return result.data;
}

/**
 * Get the floor list, it should be at least one element of the source in that floor cp or endpoints list
 */
export async function getFloors(source) {
  const buildingId = localStorage.getItem('idBuilding');
  const result = await HTTP.get(`floor/list`);
  let filteredFloors = [];
  const type = new Set(source.map(item => item.type)).size === 1 ? source[0].type : 'both';
  for (const floor of result.data) {
    let cpList, pList;
    if (type === 'controlEndpoint' || type === 'both') {
      cpList = await HTTP.get(`node/${floor.dynamicId}/control_endpoint_list`);
    }

    if (type === 'endpoint' || type === 'both') {
      pList = await HTTP.get(`node/${floor.dynamicId}/endpoint_list`);
    }

    const floorSources = [];

    if (type === 'controlEndpoint' || type === 'both') {
      for (const s of source) {
        if (s.type === 'controlEndpoint' && cpList.data.find(e => e.profileName === s.profile) && cpList.data[cpList.data.findIndex(e => e.profileName === s.profile)].endpoints.find(e => e.name === s.name)) {
          floorSources.push({...s, dynamicId: cpList.data[cpList.data.findIndex(e => e.profileName === s.profile)].endpoints.find(e => e.name === s.name).dynamicId});
        }
      }
    }

    if (floorSources.length > 0) {
      filteredFloors.push({ ...floor, sources: floorSources });
    }
  }

  // Add a section for the endpoints
  // ...
  
  return filteredFloors;
}

/**
 * Get all floors in the building
 */
// export async function getFloors(source) {
//   const buildingId = localStorage.getItem('idBuilding');
//   // get all floors
//   const result = await HTTP.get(`floor/list`);
//   return result.data;
// }

async function getArea(space) {
  const buildingId = localStorage.getItem("idBuilding");

  if (space.type === 'building') {
    const result = await HTTP.get(`building/read`);
    return +result.data.area;
  }
  else if (space.type === 'floor') {
    let area = await HTTP.get(`node/${space.dynamicId}/attributsList`);
    area = area.data[0].attributs[area.data[0].attributs.findIndex(e => e.label === 'area')].value;
    return +area;
  }
}

function isDateWithinIntervals(date, intervals) {
    const formattedTime = moment(date).format('HH:mm');
    for (const interval of intervals) {
      const start = moment(interval.start, 'HH:mm');
      const end = moment(interval.end, 'HH:mm');
      if (moment(formattedTime, 'HH:mm').isBetween(start, end, null, '[]')) {
        return true;
      }
    }
    return false;
  }
  
/**
 * Retrieves and processes time series data to create a structured calendar object for heatmap visualization.
 *
 * @param {string} space - The space or area for which the heatmap is generated.
 * @param {string} tempo - The time period for data aggregation, e.g., 'Année' (Year).
 * @param {number} currentTimestamp - The current timestamp or date for the heatmap.
 * @param {object} source - Information about the data source, including title and dynamic ID.
 * @param {object} [raw={interval: [{start: '00:00', end: '23:59'}], data: []}] - Raw data to use for heatmap generation.
 * @param {boolean} [makeCall=true] - Indicates whether an API call is required to fetch data.
 * @param {boolean[]} [dayFilter=[false, false, false, false, false, false, false]] - Array of boolean values for day filtering.
 * @param {Set} [toggleSet] - A set of specific dates that can be toggled on or off based on user preferences.
 *
 * @returns {object} A structured calendar object for heatmap visualization.
 * @throws {object} Returns a blank object if an error occurs during data retrieval or processing.
 */
export async function getHeatCal(space, tempo, currentTimestamp, source, raw = {interval: [{start: '00:00', end: '23:59'}], data: []}, makeCall = true, dayFilter = [false, false, false, false, false, false, false], toggleSet, calcul = 'Maximum') {
  try {
  var calendar = [];
  var calendarObject = {};
  calendarObject.rawData = raw.data;
  const buildingId = localStorage.getItem("idBuilding");
  let periodArray = getPeriodArray(currentTimestamp, tempo);
  let label = periodArray[0];
  let tooltipDate = periodArray[5];
  let data = [];
  let cpList, cpID = source.dynamicId, timeSeries, prevTimeSeries, prevSumSeries, sumSeries, prevTotRoot, prevAvgRoot;
  
    if (makeCall) {
      try {
        timeSeries = await HTTP.get(`/endpoint/${cpID}/timeSeries/read/${periodArray[1]}/${periodArray[2]}`);
        if (timeSeries.status !== 200) {
          
          let res = blank;
          return res;
        }
        timeSeries = timeSeries.data;
        calendarObject.rawData = timeSeries;
      } catch (error) {
        let res = blank;
        return res;
      }
    }
    else {
      timeSeries = raw.data;
    }
    // timeSeries = timeSeries.filter(({ date }) => {
    //   const formattedTime = moment(date).format('HH:mm');
    //   return (!raw.start || formattedTime >= raw.start) && (!raw.end || formattedTime <= raw.end);
    // });


    timeSeries = timeSeries.filter(({ date }) => isDateWithinIntervals(date, raw.interval));
  



    // timeSeries = timeSeries.filter(({ date }) => raw.interval.some(({ start, end }) => moment(date).isBetween(moment(start, 'HH:mm'), moment(end, 'HH:mm'), null, '[]')));


    timeSeries = timeSeries.filter(({ date }) => {
      const isoDayOfWeek = moment(date).isoWeekday();
      return (dayFilter[isoDayOfWeek - 1] === false && !toggleSet.has(moment(date).format('D/M/YYYY'))) || (dayFilter[isoDayOfWeek - 1] === true && toggleSet.has(moment(date).format('D/M/YYYY')));
    });
    calendarObject.rawInterval = timeSeries;
    let processedTimeSeries = [];
    if (tempo === 'Trimestre') {
      labelLegend = periodArray[6] + ' ' + moment(currentTimestamp).format('YYYY');
      calendarObject.y = moment(currentTimestamp).format('YYYY');
      calendarObject.n = source.title;
      calendarObject.d = prepareCalendarTri(calendarObject.y, timeSeries, periodArray[6]);
      // calendarObject.d = calendarObject.dddd.max;
      calendarObject.max = source.max;
      calendarObject.min = source.min;
      calendarObject.capacity = source.capacity;
      calendarObject.chart = {
        label: periodArray[7],
        data: [{
          label: source.name,
          tooltipDate: tooltipDate,
          backgroundColor: source.color,
          data: []
        }]
      }

      if (calcul === 'Maximum') calendarObject.chart.data[0].data = [].concat(...calendarObject.d.max);
      else if (calcul === 'Minimum') calendarObject.chart.data[0].data = [].concat(...calendarObject.d.min);
      else if (calcul === 'Moyenne') calendarObject.chart.data[0].data = [].concat(...calendarObject.d.mean);
      else if (calcul === 'Somme') calendarObject.chart.data[0].data = [].concat(...calendarObject.d.sum);

      calendarObject.chart.data[0].data = calendarObject.chart.data[0].data.map(e => e < 0 ? 0 : e);

      calendar.push(calendarObject);

      label.forEach(day => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    }
    else if (tempo === 'Année') {
      labelLegend = moment(currentTimestamp).format('YYYY');
      calendarObject.y = moment(currentTimestamp).format('YYYY');
      calendarObject.n = source.title;
      calendarObject.d = prepareCalendar(calendarObject.y, timeSeries);
      calendarObject.max = source.max;
      calendarObject.min = source.min;
      calendarObject.capacity = source.capacity;
      calendar.push(calendarObject);
      label.forEach(month => {
        processedTimeSeries.push(
          timeSeries.filter(elem => moment(elem.date).format('MMM') === month)
            .reduce((sum, elem) => sum + elem.value, 0)
        );
      });
    } else {
      processedTimeSeries = timeSeries;
    }
    return calendarObject;
    
  
    
  
}
catch (e) {
  let res = blank;
  return res;
}
  return calendarObject;

}


function getPeriodArray(timestamp, period) {
  if (period === 'Journée') {
    var startOfDay = moment(timestamp).startOf('day');
    var endOfDay = moment(timestamp).endOf('day');
    var hoursInDay = [];
    var tooltipDate = [];
    var currentHour = moment(startOfDay);
    while (currentHour.isSameOrBefore(endOfDay)) {
      hoursInDay.push(currentHour.format('HH'));
      tooltipDate.push(moment(currentHour).format('ddd DD/MM/YYYY HH:mm').slice(0, 1).toUpperCase() + moment(currentHour).format('ddd DD/MM/YYYY HH:mm').slice(1));
      currentHour.add(1, 'hour');
    }
    
    return [hoursInDay,
      moment(timestamp).startOf('day').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('day').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'day').startOf('day').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'day').endOf('day').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate
    ];
  } else if (period === 'Semaine') {
    var startOfWeek = moment(timestamp).startOf('week');
    var endOfWeek = moment(timestamp).endOf('week');
    var daysInMonth = [];
    var abstractDaysInMonth = [];
    var tooltipDate = [];
    var currentDay = moment(startOfWeek);
    while (currentDay.isSameOrBefore(endOfWeek)) {
      daysInMonth.push(currentDay.format('DD MMM'));
      abstractDaysInMonth.push(currentDay.format('dddd').slice(0, 1).toUpperCase() + currentDay.format('dddd').slice(1));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    return [daysInMonth,
      moment(timestamp).startOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'weeks').startOf('week').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'weeks').endOf('week').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate,
      abstractDaysInMonth
    ];
  } else if (period === 'Mois') {
    var startOfMonth = moment(timestamp).startOf('month');
    var endOfMonth = moment(timestamp).endOf('month');
    var daysInMonth = [];
    var abstractDaysInMonth = [];
    var tooltipDate = [];
    var currentDay = moment(startOfMonth);
    while (currentDay.isSameOrBefore(endOfMonth)) {
      abstractDaysInMonth.push(currentDay.format('DD'));
      daysInMonth.push(currentDay.format('DD MMM'));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    return [daysInMonth,
      moment(timestamp).startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'months').startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'months').endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate,
      abstractDaysInMonth
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
  } else if (period === 'Trimestre') {
    let currentMM = moment(timestamp).format('MM');
    let T = 'T'+Math.ceil(currentMM / 3);
    var startOfTrimester;
    var endOfTrimester;
    var currentDay;
    var endDay;
    switch (T) {
        case 'T1':
            startOfTrimester = moment(`01/01/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').startOf('day').format('DD-MM-yyyy HH:mm:ss');
            endOfTrimester = moment(`31/03/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').endOf('day').format('DD-MM-yyyy HH:mm:ss');
            currentDay = moment(`01/01/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            endDay = moment(`31/03/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            break;

        case 'T2':
            startOfTrimester = moment(`01/04/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').startOf('day').format('DD-MM-yyyy HH:mm:ss');
            endOfTrimester = moment(`30/06/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').endOf('day').format('DD-MM-yyyy HH:mm:ss');
            currentDay = moment(`01/04/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            endDay = moment(`30/06/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            break;
    
        case 'T3':
            startOfTrimester = moment(`01/07/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').startOf('day').format('DD-MM-yyyy HH:mm:ss');
            endOfTrimester = moment(`30/09/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').endOf('day').format('DD-MM-yyyy HH:mm:ss');
            currentDay = moment(`01/07/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            endDay = moment(`30/09/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            break;
    
        case 'T4':
            startOfTrimester = moment(`01/10/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').startOf('day').format('DD-MM-yyyy HH:mm:ss');
            endOfTrimester = moment(`31/12/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY').endOf('day').format('DD-MM-yyyy HH:mm:ss');
            currentDay = moment(`01/10/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            endDay = moment(`31/12/${moment(timestamp).format('YYYY')}`, 'DD/MM/YYYY');
            break;
    }

    var daysIn3Months = [];
    var abstractDaysIn3Months = [];
    var tooltipDate = [];
    while (currentDay.isSameOrBefore(endDay)) {
      daysIn3Months.push(currentDay.format('DD MMM'));
      abstractDaysIn3Months.push(currentDay.format('DD'));
      tooltipDate.push(moment(currentDay).format('ddd DD/MM/YYYY').slice(0, 1).toUpperCase() + moment(currentDay).format('ddd DD/MM/YYYY').slice(1));
      currentDay.add(1, 'day');
    }
    
    return [daysIn3Months,
      startOfTrimester,
      endOfTrimester,
      moment(timestamp).add(-3, 'months').startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-1, 'months').endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate,
      T,
      abstractDaysIn3Months
    ];
  } else {
    return [];
  }
}


function generateMonthlyData(y) {
  const monthlyData = [];
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
  return {
    n: '',
    y: y,
    d: monthlyData
  };
}

function generateMonthlyDataTri(y, t) {
  const monthlyData = [];
  const date = moment(y, 'YYYY');
  var tValue = ['T1', 'T2', 'T3', 'T4'].indexOf(t);
  var start = tValue * 3;
  var end = start + 3;
  
  // loop through 12 months
  for (let i = start; i < end; i++) {
    let daysInMonth = date.month(i).daysInMonth();
    if (i === 1) { // February
      if (moment([y]).isLeapYear()) {
        daysInMonth = 29;
      }
    }
    const monthArray = Array(daysInMonth).fill(-1);
    monthlyData.push(monthArray);
  }
  return {
    n: '',
    y: y,
    d: monthlyData
  };
}

function prepareCalendar(year, timeSeries) {
  var sumData = generateMonthlyData(year).d;
  var maxData = generateMonthlyData(year).d;
  var minData = generateMonthlyData(year).d;
  var meanData = generateMonthlyData(year).d;
  var month, day;
  const occurrenceCounts = {};
  for (const timeSerie of timeSeries) {
    month = +moment(timeSerie.date).format('MM') - 1;
    day = +moment(timeSerie.date).format('DD') - 1;
    sumData[month][day] = (sumData[month][day] === -1) ? timeSerie.value : sumData[month][day] + timeSerie.value;
    maxData[month][day] = (maxData[month][day] < timeSerie.value) ? timeSerie.value : maxData[month][day];
    minData[month][day] = (minData[month][day] > timeSerie.value || minData[month][day] === -1) ? timeSerie.value : minData[month][day];
    const key = `${month}-${day}`;
    occurrenceCounts[key] = (occurrenceCounts[key] || 0) + 1;

    meanData[month][day] = (meanData[month][day] == -1) ? timeSerie.value : meanData[month][day] + timeSerie.value;
  }
  for (let i = 0; i < meanData.length; i++) {
    for (let j = 0; j < meanData[i].length; j++) {
      const month = i;
      const day = j;
      const key = `${month}-${day}`;
      const count = occurrenceCounts[key] || 1;
      meanData[i][j] = meanData[i][j] / count;
    }
  }
  return {sum: sumData, max: maxData, min: minData, mean: meanData};
}

function prepareCalendarTri(year, timeSeries, T) {
  var threshold;
  if (T === 'T1') threshold = 0;
  else if (T === 'T2') threshold = 3;
  else if (T === 'T3') threshold = 6;
  else if (T === 'T4') threshold = 9;
  var sumData = generateMonthlyDataTri(year, T).d;
  var maxData = generateMonthlyDataTri(year, T).d;
  var minData = generateMonthlyDataTri(year, T).d;
  var meanData = generateMonthlyDataTri(year, T).d;
  var month, day;
  const occurrenceCounts = {};
  for (const timeSerie of timeSeries) {
    month = +moment(timeSerie.date).format('MM') - 1 - threshold;
    month = (month < 0) ? 0 : month;
    day = +moment(timeSerie.date).format('DD') - 1;
    sumData[month][day] = (sumData[month][day] === -1) ? timeSerie.value : sumData[month][day] + timeSerie.value;
    maxData[month][day] = (maxData[month][day] < timeSerie.value) ? timeSerie.value : maxData[month][day];
    minData[month][day] = (minData[month][day] > timeSerie.value || minData[month][day] === -1) ? timeSerie.value : minData[month][day];
    const key = `${month}-${day}`;
    occurrenceCounts[key] = (occurrenceCounts[key] || 0) + 1;

    meanData[month][day] = (meanData[month][day] == -1) ? timeSerie.value : meanData[month][day] + timeSerie.value;
  }
  for (let i = 0; i < meanData.length; i++) {
    for (let j = 0; j < meanData[i].length; j++) {
      const month = i;
      const day = j;
      const key = `${month}-${day}`;
      const count = occurrenceCounts[key] || 1;
      meanData[i][j] = meanData[i][j] / count;
    }
  }
  return {sum: sumData, max: maxData, min: minData, mean: meanData};
}

export async function getSolo(space, tempo, currentTimestamp, format, controlEndpoints, color, totalCard) {
  let ts = moment(currentTimestamp, format).valueOf();
  if (tempo === 'Trimestre') {
    let t = currentTimestamp.split('/');
    switch(t[0]) {
      case 'T1': ts = moment(`01/01/${t[1]}`, 'DD/MM/YYYY'); break;
      case 'T2': ts = moment(`01/04/${t[1]}`, 'DD/MM/YYYY'); break;
      case 'T3': ts = moment(`01/07/${t[1]}`, 'DD/MM/YYYY'); break;
      case 'T4': ts = moment(`01/10/${t[1]}`, 'DD/MM/YYYY'); break;
    }
  }
  let res = await getData(space, tempo, ts, controlEndpoints);
  res[1][0].stack = currentTimestamp;
  res[1][0].backgroundColor = color;
  res[2][0].root = false;
  res[2][0].color = color;
  res[3][0].root = false;
  res[3][0].color = color;
  let comparison = '∞';
  if (totalCard[0].value !== 0 && res[3][0].value > 0) {
    comparison = (((res[3][0].value - totalCard[0].value) / totalCard[0].value) * 100).toFixed(1) + '%';
    // comparison = (res[3][0].value * 100 / totalCard[0].value).toFixed(1) + '%'
  }
  res[3][0].subValue = comparison;
  res[3][0].subtitle = 'de la consommation de référence';

  res[5][0].root = false;
  res[5][0].color = color;
  res[5][0].title = 'Consommation au m²';
  res[5][0].title = 'Consommation au m²';
  // res[5][0].subValue = comparison;
  // res[5][0].subtitle = 'de la consommation de référence';

  return [res[1][0], res[2][0], res[3][0], res[5][0], res[4][0], res[0]];
}