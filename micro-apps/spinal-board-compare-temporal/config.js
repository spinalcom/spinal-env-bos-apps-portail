/*
object = {
    title: "Consommation d'énergie",
    chart: 'bar',
    unit: 'Kw',
    compareBy: 'date', //part
    controlEndpoints: [
        {
            title
            label: 'Energie globale',
            name: 'Energie globale',
            color: '#14202c',
            unit: 'kWh',
            stackGroup: '0',
            title: 'd\'énergie consommés',
            todayTitle: 'today',
            averageTitle: 'Consommation moyenne',
            totalTitle: 'Consommation totale',
            subtitle: 'today',
            todaySubtitle: 'today ${date}',
            averageSubtitle: '',
            totalSubtitle: 'TOTAL SUBTITLE',
            root: true,
        },
    ]
}
*/
export default config = {
    chart: 'bar',
    unit: 'kWh',
    calendarLegend: 'Le jour le plus où le batiment a le plus consommé est le',
    monthStripeLegend: 'Le mois où le bâtiment a le plus consommé est',
    compareBy: 'date', //part

    // Cards title and subtitle

    todaysCardTitle: 'Moyenne',
    todaysCardSubtitle: 'Sur la période sélectionnée',

    averageCardTitle: 'Total Rapporté au m²',
    averageCardSubtitle: 'Sur la période sélectionnée',

    totalCardTitle: 'Total',
    totalCardSubtitle: 'Sur la période sélectionnée',

    controlEndpoints: [
        {
            title: "Énergie globale",
            // subtitle: "coucou",
            label: 'Energie globale',
            min: null,
            max: 3500,
            name: 'Energie globale',
            color: '#14202c',
            unit: 'kWh',
            // stackGroup: '0',
            source: {
                building : {
                    profileName: 'KPI',
                    name: 'Energie globale',
                },
                floor: {
                    profileName: 'KPI USI',
                    name: 'Energie globale',
                },
            },
            averageTitle: 'En moyenne',
            averageSubtitle: '',
            totalTitle: 'Consommation totale',
            totalSubtitle: 'Par rapport à la période précédente',
            root: true,
        },
        {
            title: "Éclairage",
            // subtitle: "coucou",
            label: 'Éclairage',
            min: null,
            max: 3500,
            name: 'Éclairage',
            color: '#E8D712',
            unit: 'kWh',
            // stackGroup: '0',
            source: {
                building : {
                    profileName: 'KPI',
                    name: 'Eclairage',
                },
                floor: {
                    profileName: 'KPI USI',
                    name: 'Eclairage',
                },
            },
            averageTitle: 'En moyenne',
            averageSubtitle: '',
            totalTitle: 'Consommation totale',
            totalSubtitle: 'Par rapport à la période précédente',
            root: true,
        },
        {
            title: "Chauffage",
            // subtitle: "coucou",
            label: 'Chauffage',
            min: null,
            max: 3500,
            name: 'Chauffage',
            color: '#5444AE',
            unit: 'kWh',
            // stackGroup: '0',
            source: {
                building : {
                    profileName: 'KPI',
                    name: 'CVC',
                },
                floor: {
                    profileName: 'KPI USI',
                    name: 'CVC',
                },
            },
            averageTitle: 'En moyenne',
            averageSubtitle: '',
            totalTitle: 'Consommation totale',
            totalSubtitle: 'Par rapport à la période précédente',
            root: true,
        },
        {
            title: "Eau sanitaire",
            // subtitle: "coucou",
            label: 'Eau sanitaire',
            min: null,
            max: 3500,
            name: 'Eau sanitaire',
            color: '#418fdd',
            unit: 'L',
            // stackGroup: '0',
            source: {
                building : {
                    profileName: 'KPI',
                    name: 'Eau sanitaire',
                },
                floor: {
                    profileName: 'KPI USI',
                    name: 'Eau sanitaire',
                },
            },
            averageTitle: 'En moyenne',
            averageSubtitle: '',
            totalTitle: 'Consommation totale',
            totalSubtitle: 'Par rapport à la période précédente',
            root: true,
        },
        {
            title: "Production d'énergie",
            // subtitle: "coucou",
            label: "Production d'énergie",
            min: null,
            max: 3500,
            name: "Production d'énergie",
            color: '#E8D712',
            unit: 'kWh',
            // stackGroup: '0',
            source: {
                building : {
                    profileName: 'KPI',
                    name: 'Production énergie',
                },
                floor: {
                    profileName: 'KPI USI',
                    name: 'Production énergie',
                },
            },
            averageTitle: 'En moyenne',
            averageSubtitle: '',
            totalTitle: 'Production totale',
            totalSubtitle: 'Par rapport à la période précédente',
            root: true,
        },
    ],
    
    cards: ['total', 'average', 'today'], // ['total', 'average', 'today']
};

// "water": "Eau globale",
// "sanitary_water": "Eau sanitaire",
// "people_number": "Nombre de personnes",
// "energy": "Energie globale",
// "lighting": "Eclairage",
// "heating": "Chauffage"