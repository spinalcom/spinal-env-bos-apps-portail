
import HTTP from "global-components/requests/http-constants";
HTTP.setApiMode(process.env.SPINAL_API_MODE)
import moment from 'moment';
import fr from 'moment/locale/fr';

export async function getBuilding(cp) {
  const result = await HTTP.get(`building/read`);
  console.log(result);

  let cpList = await HTTP.get(`node/${result.data.dynamicId}/control_endpoint_list`);
  console.log(cpList.data, cp.source.building.profileName);

  const control_endpoint = cpList.data.find(e => e.profileName === cp.source.building.profileName);
  const endpoint_id = control_endpoint.endpoints.find(e => e.name === cp.name).dynamicId;
  result.data.cp = endpoint_id;
  return result.data;
}

export async function getFloors(cp) {
  // get all floors
  const result = await HTTP.get(`floor/list`);
  // for each floor get its cp names
  let promises = result.data.map(async (floor) => {
    let cpList = await HTTP.get(`node/${floor.dynamicId}/control_endpoint_list`);
    if (cpList.data.length !== 0) {
      const control_endpoint = cpList.data.find(e => e.profileName === cp.source.floor.profileName);
      const endpoint = control_endpoint.endpoints.find(e => e.name === cp.name);
      if (endpoint) {
        let area = await HTTP.get(`node/${floor.dynamicId}/attributsList`);
        area = area.data[0].attributs.find(e => e.label === 'area').value;
        floor.area = area;
        floor.cp = endpoint.dynamicId;
        return floor;
      }

    }
    //  if (endpoint) { 
    //   let area = await HTTP.get(`node/${floor.dynamicId}/attributsList`);
    //   area = area.data[0].attributs.find(e => e.label === 'area').value;
    //   floor.area = area;
    //   floor.cp = endpoint.dynamicId;
    //   return floor;
    // }


    return null;

    // if there is a match add floor to array + area + cp id
    // if (cpList.data[j].endpoints[i].name === cp[0].name) {
    //   let area = await HTTP.get(`node/${floor.dynamicId}/attributsList`);
    //   area = area.data[0].attributs[area.data[0].attributs.findIndex(e => e.label === 'area')].value;
    //   floor.area = area;
    //   floor.cp = cpList.data[j].endpoints[i].dynamicId;
    //   return floor
    // }

  });
  let values = await Promise.all(promises);
  let filteredValues = values.filter((value) => value !== null);
  return filteredValues;
}

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

export async function getData(space, tempo, currentTimestamp, controlEndpoints) {
  const spaceArea = await getArea(space);
  var labelLegend = '';
  var calendar = [];
  var calendarObject;
  var control_point;
  var endpointDynamicId;
  const buildingId = localStorage.getItem("idBuilding");
  let avg = [], total = [], meter = [];
  let periodArray = getPeriodArray(currentTimestamp, tempo);
  let label = periodArray[0];
  let tooltipDate = periodArray[5];
  let data = [];
  let cpList, cpID, timeSeries, prevTimeSeries, prevSumSeries, sumSeries, prevTotRoot, prevAvgRoot;
  try {

    cpList = await HTTP.get(`node/${space.dynamicId}/control_endpoint_list`);

    space.type == "building" ? control_point = cpList.data.find(e => e.profileName === controlEndpoints.source.building.profileName) :
      control_point = cpList.data.find(e => e.profileName === controlEndpoints.source.floor.profileName);

    space.type == "building" ? endpointDynamicId = control_point.endpoints.find(e => e.name === controlEndpoints.source.building.name).dynamicId :
      endpointDynamicId = control_point.endpoints.find(e => e.name === controlEndpoints.source.floor.name).dynamicId;

    if (endpointDynamicId) {
      timeSeries = await HTTP.get(`endpoint/${endpointDynamicId}/timeSeries/read/${periodArray[1]}/${periodArray[2]}`);
      timeSeries = timeSeries.data;
      let processedTimeSeries = [];
      if (tempo === 'Journée') {
        labelLegend = moment(currentTimestamp).format('DD/MM/YYYY');
        label.forEach(hour => {
          processedTimeSeries.push(
            timeSeries.filter(elem => moment(elem.date).format('HH') === hour)
              .reduce((sum, elem) => sum + elem.value, 0)
          );
        });
      }
      else if (tempo === 'Semaine') {
        labelLegend = 'S' + moment(currentTimestamp).format('WW') + ' (' + moment(currentTimestamp).startOf('week').format('DD/MM/YYYY') + ' - ' + moment(currentTimestamp).endOf('week').format('DD/MM/YYYY') + ')';
        label.forEach(day => {
          processedTimeSeries.push(
            timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
              .reduce((sum, elem) => sum + elem.value, 0)
          );
        });
        label = periodArray[6];

      } else if (tempo === 'Mois') {
        labelLegend = moment(currentTimestamp).format('MMMM YYYY');
        label.forEach(day => {
          processedTimeSeries.push(
            timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
              .reduce((sum, elem) => sum + elem.value, 0)
          );
        });
        label = periodArray[6];
      } else if (tempo === 'Année') {
        labelLegend = moment(currentTimestamp).format('YYYY');
        calendarObject = {}
        calendarObject.y = moment(currentTimestamp).format('YYYY');
        calendarObject.n = controlEndpoints.name;
        calendarObject.d = prepareCalendar(calendarObject.y, timeSeries);
        calendarObject.max = controlEndpoints.max;
        calendarObject.min = controlEndpoints.min;
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
      } else if (tempo === 'Trimestre') {
        labelLegend = periodArray[6] + ' ' + moment(currentTimestamp).format('YYYY');
        label.forEach(day => {
          processedTimeSeries.push(
            timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
              .reduce((sum, elem) => sum + elem.value, 0)
          );
        });
        label = periodArray[7];
      } else {
        processedTimeSeries = timeSeries;
      }
      sumSeries = timeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
      if (controlEndpoints.root == true) {
        prevTotRoot = sumSeries;
      }
      let a = (sumSeries * 100 / prevTotRoot).toFixed(1);
      if (controlEndpoints.root == true) {
        total.push({
          color: controlEndpoints.color,
          value: sumSeries,
          unit: controlEndpoints.unit,
          title: labelLegend.charAt(0).toUpperCase() + labelLegend.slice(1),
          subValue: ' ',
          subtitle: 'Consommation de référence',
          root: controlEndpoints.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }
      else
        total.push({
          color: controlEndpoints.color,
          value: sumSeries,
          unit: controlEndpoints.unit,
          title: controlEndpoints.totalTitle,
          subValue: a + '%',
          subtitle: controlEndpoints.totalSubtitle,
          root: controlEndpoints.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      if (controlEndpoints.root == true) {
        meter.push({
          color: controlEndpoints.color,
          value: +(sumSeries / label.length).toFixed(1),
          unit: controlEndpoints.unit,
          title: controlEndpoints.averageTitle,
          subValue: ' ',
          subtitle: ' ',
          root: controlEndpoints.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }
      else {
        meter.push({
          color: controlEndpoints.color,
          value: +(sumSeries / label.length).toFixed(1),
          unit: controlEndpoints.unit,
          title: controlEndpoints.averageTitle,
          subValue: ' ',
          subtitle: ' ',
          root: controlEndpoints.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }


      sumSeries = sumSeries / spaceArea;
      if (controlEndpoints.root == true) {
        prevAvgRoot = sumSeries;
      }
      let b = (sumSeries * 100 / prevAvgRoot).toFixed(1);
      if (controlEndpoints.root == true) {
        avg.push({
          color: controlEndpoints.color,
          value: sumSeries,
          unit: controlEndpoints.unit + '/m²',
          title: 'Au m²',
          subValue: '100%',
          subtitle: controlEndpoints.averageSubtitle,
          root: controlEndpoints.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }
      else {
        avg.push({
          color: controlEndpoints.color,
          value: sumSeries,
          unit: controlEndpoints.unit + '/m²',
          title: 'Au m²',
          subValue: b + '%',
          subtitle: controlEndpoints.averageSubtitle,
          root: controlEndpoint.root,
          cpID: cpID,
          startDate: periodArray[3],
          endDate: periodArray[4],
          label: label.length,
        })
      }

      data.push({
        label: labelLegend.charAt(0).toUpperCase() + labelLegend.slice(1),
        backgroundColor: controlEndpoints.color,
        data: processedTimeSeries,
        stack: controlEndpoints.stackGroup + '1',
        tooltipDate: tooltipDate
      });



    }



    // for (const controlEndpoint of controlEndpoints) {
    //   const controlEndpointName = cpList.data.find( e => e.profileName === controlEndpoint.source.building.profileName);
    //   const endpoint = controlEndpointName.endpoints.find(e => e.name === controlEndpoint.source.building.name);
    //   for (let j = 0; j < cpList.data.length; j++) {
    //     for (let i = 0; i < cpList.data[j].endpoints.length; i++) {
    //       if (cpList.data[j].endpoints[i].name === controlEndpoint.name) {
    //         cpID = cpList.data[j].endpoints[i].dynamicId;
    //       }
    //     }
    //   }

    //   if (cpID) {
    //     timeSeries = await HTTP.get(`endpoint/${cpID}/timeSeries/read/${periodArray[1]}/${periodArray[2]}`);
    //     timeSeries = timeSeries.data;
    //     let processedTimeSeries = [];
    //     if (tempo === 'Journée') {
    //       labelLegend = moment(currentTimestamp).format('DD/MM/YYYY');
    //       label.forEach(hour => {
    //         processedTimeSeries.push(
    //           timeSeries.filter(elem => moment(elem.date).format('HH') === hour)
    //             .reduce((sum, elem) => sum + elem.value, 0)
    //         );
    //       });
    //     }
    //   else if (tempo === 'Semaine') {
    //     labelLegend = 'S' + moment(currentTimestamp).format('WW') + ' (' + moment(currentTimestamp).startOf('week').format('DD/MM/YYYY') + ' - ' + moment(currentTimestamp).endOf('week').format('DD/MM/YYYY') + ')';
    //     label.forEach(day => {
    //       processedTimeSeries.push(
    //         timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
    //           .reduce((sum, elem) => sum + elem.value, 0)
    //       );
    //     });
    //     label = periodArray[6];

    //   } else if (tempo === 'Mois') {
    //     labelLegend = moment(currentTimestamp).format('MMMM YYYY');
    //     label.forEach(day => {
    //       processedTimeSeries.push(
    //         timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
    //           .reduce((sum, elem) => sum + elem.value, 0)
    //       );
    //     });
    //     label = periodArray[6];
    //   } else if (tempo === 'Année') {
    //     labelLegend = moment(currentTimestamp).format('YYYY');
    //     calendarObject = {}
    //     calendarObject.y = moment(currentTimestamp).format('YYYY');
    //     calendarObject.n = controlEndpoint.name;
    //     calendarObject.d = prepareCalendar(calendarObject.y, timeSeries);
    //     calendarObject.max = controlEndpoint.max;
    //     calendarObject.min = controlEndpoint.min;
    //     calendar.push(calendarObject);
    //     label.forEach(month => {
    //       processedTimeSeries.push(
    //         timeSeries.filter(elem => moment(elem.date).format('MMM') === month)
    //           .reduce((sum, elem) => sum + elem.value, 0)
    //       );
    //     });
    //   } else if (tempo === 'Décennie') {
    //     label.forEach(year => {
    //       processedTimeSeries.push(
    //         timeSeries.filter(elem => moment(elem.date).format('YYYY') === year)
    //           .reduce((sum, elem) => sum + elem.value, 0)
    //       );
    //     });
    //   } else if (tempo === 'Trimestre') {
    //     labelLegend = periodArray[6] + ' ' + moment(currentTimestamp).format('YYYY');
    //     label.forEach(day => {
    //       processedTimeSeries.push(
    //         timeSeries.filter(elem => moment(elem.date).format('DD MMM') === day)
    //           .reduce((sum, elem) => sum + elem.value, 0)
    //       );
    //     });
    //     label = periodArray[7];
    //   } else {
    //     processedTimeSeries = timeSeries;
    //   }
    //   sumSeries = timeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
    //   if (controlEndpoint.root == true) {
    //     prevTotRoot = sumSeries;
    //   }
    //   // prevSumSeries = prevTimeSeries.reduce((accumulator, current) => accumulator + current.value, 0);
    //   // let comparison = '∞';
    //   // if (prevSumSeries) {
    //   //   comparison = (((sumSeries - prevSumSeries) / prevSumSeries) * 100).toFixed(1);
    //   // }
    //   let a = (sumSeries * 100 / prevTotRoot).toFixed(1);
    //   if (controlEndpoint.root == true) {
    //     total.push({
    //       color: controlEndpoint.color,
    //       value: sumSeries,
    //       unit: controlEndpoint.unit,
    //       title: labelLegend.charAt(0).toUpperCase() + labelLegend.slice(1),
    //       subValue: ' ',
    //       subtitle: 'Consommation de référence',
    //       root: controlEndpoint.root,
    //       cpID: cpID,
    //       startDate: periodArray[3],
    //       endDate: periodArray[4],
    //       label: label.length,
    //     })
    //   }
    //   else
    //     total.push({
    //       color: controlEndpoint.color,
    //       value: sumSeries,
    //       unit: controlEndpoint.unit,
    //       title: controlEndpoint.totalTitle,
    //       subValue: a + '%',
    //       subtitle: controlEndpoint.totalSubtitle,
    //       root: controlEndpoint.root,
    //       cpID: cpID,
    //       startDate: periodArray[3],
    //       endDate: periodArray[4],
    //       label: label.length,
    //     })
    //     if (controlEndpoint.root == true) {
    //       meter.push({
    //         color: controlEndpoint.color,
    //         value: +(sumSeries/label.length).toFixed(1),
    //         unit: controlEndpoint.unit,
    //         title: controlEndpoint.averageTitle,
    //         subValue: ' ',
    //         subtitle: ' ',
    //         root: controlEndpoint.root,
    //         cpID: cpID,
    //         startDate: periodArray[3],
    //         endDate: periodArray[4],
    //         label: label.length,
    //       })
    //     }
    //     else {
    //       meter.push({
    //         color: controlEndpoint.color,
    //         value: +(sumSeries/label.length).toFixed(1),
    //         unit: controlEndpoint.unit,
    //         title: controlEndpoint.averageTitle,
    //         subValue: ' ',
    //         subtitle: ' ',
    //         root: controlEndpoint.root,
    //         cpID: cpID,
    //         startDate: periodArray[3],
    //         endDate: periodArray[4],
    //         label: label.length,
    //       })
    //     }


    //     sumSeries = sumSeries / spaceArea;
    //     if (controlEndpoint.root == true) {
    //       prevAvgRoot = sumSeries;
    //     }
    //     let b = (sumSeries * 100 / prevAvgRoot).toFixed(1);
    //     if (controlEndpoint.root == true) {
    //       avg.push({
    //         color: controlEndpoint.color,
    //         value: sumSeries,
    //         unit: controlEndpoint.unit + '/m²',
    //         title: 'Au m²',
    //         subValue: '100%',
    //         subtitle: controlEndpoint.averageSubtitle,
    //         root: controlEndpoint.root,
    //         cpID: cpID,
    //         startDate: periodArray[3],
    //         endDate: periodArray[4],
    //         label: label.length,
    //       })
    //     }
    //     else {
    //       avg.push({
    //         color: controlEndpoint.color,
    //         value: sumSeries,
    //         unit: controlEndpoint.unit + '/m²',
    //         title: 'Au m²',
    //         subValue: b + '%',
    //         subtitle: controlEndpoint.averageSubtitle,
    //         root: controlEndpoint.root,
    //         cpID: cpID,
    //         startDate: periodArray[3],
    //         endDate: periodArray[4],
    //         label: label.length,
    //       })
    //     }

    //     data.push({
    //       label: labelLegend.charAt(0).toUpperCase() + labelLegend.slice(1),
    //       backgroundColor: controlEndpoint.color,
    //       data: processedTimeSeries,
    //       stack: controlEndpoint.stackGroup+'1',
    //       tooltipDate: tooltipDate
    //     });


    // }

    // }
  }
  catch (e) {
    console.log(e)
    return [null, null, null, null, calendar]
  }
  return [label, data, avg, total, calendar, meter];
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
    let T = 'T' + Math.ceil(currentMM / 3);
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
      moment(timestamp).add(-5, 'months').startOf('month').format('DD-MM-yyyy HH:mm:ss'),
      moment(timestamp).add(-3, 'months').endOf('month').format('DD-MM-yyyy HH:mm:ss'),
      tooltipDate,
      T,
      abstractDaysIn3Months
    ];
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
  var startOfDay = moment().startOf('day').format('DD-MM-yyyy HH:mm:ss');
  var endOfDay = moment().endOf('day').format('DD-MM-yyyy HH:mm:ss');
  let cpList, cpID, timeSeries, sumSeries, sub;
  for (const controlEndpoint of controlEndpoints) {
    cpList = await HTTP.get(`node/${space.dynamicId}/control_endpoint_list`);
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
        }
      }
    }
    if (cpID) {
      timeSeries = await HTTP.get(`endpoint/${cpID}/timeSeries/read/${startOfDay}/${endOfDay}`);
      // timeSeries = await HTTP.get(`endpoint/${cpID}/timeSeries/read/07-02-2023 00:00:00/07-02-2023 23:59:59`);
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
    }
  }
  let sum = data[0].value;
  for (let i = 1; i < data.length; i++) {
    if (data[i].unit !== data[i - 1].unit) {
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
  return {
    n: '',
    y: y,
    d: monthlyData
  };
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

export function getTempoSuggestion(tempo, currentTimestamp) {
  if (tempo === 'Mois') {
    return [
      'Mois choisi (' + moment(currentTimestamp).format('MMMM YYYY') + ')',
      'Mois précédent (' + moment(currentTimestamp).add(-1, 'months').format('MMMM YYYY') + ')',
      'Même mois que l\'année dernière (' + moment(currentTimestamp).add(-12, 'months').format('MMMM YYYY') + ')']
  }
}

export async function getSolo(space, tempo, currentTimestamp, format, controlEndpoints, color, totalCard) {
  let ts = moment(currentTimestamp, format).valueOf();
  if (tempo === 'Trimestre') {
    let t = currentTimestamp.split('/');
    switch (t[0]) {
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
  res[5][0].title = 'Au m²';
  res[5][0].title = 'Au m²';
  // res[5][0].subValue = comparison;
  // res[5][0].subtitle = 'de la consommation de référence';

  return [res[1][0], res[2][0], res[3][0], res[5][0], res[4][0], res[0]];
}