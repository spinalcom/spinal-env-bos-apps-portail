export default {


  // test api ubigreen
  // config: {
  //   contextType: 'équipement',
  //   title: 'Etat des positions de travail',
  //   context: 'Contexte équipement capteur',
  //   groupingCategory: "Ubigreen",
  //   bimObjectGroup: "All",
  //   headers: [
  //         { text: 'Nom', value: 'name', filterable: true, sortable: true, unit: '', width: "25%" }, 
  //         { text: 'Ubigreen', value: 'Ubigreen', sortable: false, unit: '' , isBoolean:true, editBoolean:"Occupé/Disponible",addToCapacityTab:true ,colorBoolean: "red/green"},
  //         { text: 'Statut-Occupation', value: 'Statut-Occupation', sortable: true, unit: '', isBoolean:true, editBoolean:"Occupé/Disponible",addToCapacityTab:true,colorBoolean: "red/green"},
  //       ], 
  //   enableWebSocket: false,
  //   enableCapacityTab: true,
  //   itemPerTable : 10
  // },




 //test api spinaltower endpoint + controleendpoint test 
 config: {
  contextType: 'équipement',
  title: 'Etat des Climatisations',
  context: 'Equipments context',
  groupingCategory: "CVC chauffage ventillation climatisation",
  bimObjectGroup: "Climatisation",
  headers: [
    {text: 'Nom',type:'controle point' , value: 'name', sortable: true, unit: '', width: "25%" },
    { text: 'CO2',type:'controle point' , value: 'CO2', sortable: false, unit: '%' },
    {  text: 'AlarmeCO2',type:'controle point' , value: 'Alarme CO2', unit: '', isBoolean: true, editBoolean: "Activé/Désactivé", colorBoolean: "red/green", addToCapacityTab: true, filterable: true, sortable: true, },
    { text: 'Température',type:'controle point' , value: 'Température', sortable: true, unit: '°C', filterable: true },
    // { text: 'Consigne Température',type:'controle point' , value: 'Consigne Température', sortable: true, unit: '°C', filterable: true },
    { text: 'Température endpoint',  type:'endpoint' , value: 'endpoint/Température', sortable: true, filterable: true , unit:'°C' },
    { text: 'Présence endpoint',  type:'endpoint' , value: 'endpoint/Présence', sortable: true, filterable: true , unit: '', isBoolean: true, editBoolean: "Activé/Désactivé", colorBoolean: "red/green",},
  ],
  enableWebSocket: false,
  enableCapacityTab: true,
},





}