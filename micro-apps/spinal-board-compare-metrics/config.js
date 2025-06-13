
module.exports = {
    title: "CONSOMMATION D'ÉNERGIE",
    subtitle: "Part des differentes consomations dans la consommation d'énergie globale",
    chart: 'bar',
    unit: 'kWh',
    calendarLegend: 'Le jour le plus où le batiment a le plus consommé est le',
    monthStripeLegend: 'Le mois où le bâtiment a le plus consommé est',
    compareBy: 'date', //part
    
    // Cards title and subtitle

    todaysCardTitle: "Aujourd'hui",
    todaysCardSubtitle: 'Consommations',

    averageCardTitle: 'Consommation moyenne',
    averageCardSubtitle: 'Sur la période sélectionnée',

    totalCardTitle: 'Consommation totale',
    totalCardSubtitle: 'Sur la période sélectionnée',

    controlEndpoints: [
        {
            label: 'Energie globale',
            min: null,
            max: 2500,
            name: 'Energie globale',
            color: '#14202c',
            unit: 'kWh',
            stackGroup: '0',

            title: 'Energie globale',
            subtitle: 'today',
            todayTitle: 'today',

            averageTitle: 'Consommation globale',
            averageSubtitle: '',

            totalTitle: 'Consommation globale',
            totalSubtitle: 'Consommation de référence',
            root: true,

        },
        {
            label: 'CVC',
            min: null,
            max: 3500,
            name: 'CVC',
            color: '#5444ae',
            unit: 'kWh',
            stackGroup: '01',

            title: 'Pour la CVC',
            todayTitle: 'today',
            subtitle: "De la consommation globale",
            totalSubtitle: "De la consommation globale",

            averageTitle: 'Pour la CVC',
            averageSubtitle: '',

            totalTitle: 'Pour la CVC',
            totalSubtitle: 'De la consommation globale',
            root: false,

        },
        {
            label: 'Éclairage',
            min: null,
            max: 2000,
            name: 'Eclairage',
            color: '#e8d712',
            unit: 'kWh',
            stackGroup: '01',

            title: "Pour l'Éclairage",
            todayTitle: 'today',
            subtitle: "De la consommation globale",
            totalSubtitle: "De la consommation globale",

            averageTitle: "Pour l'Éclairage",
            averageSubtitle: '',

            totalTitle: "Pour l'Éclairage",
            totalSubtitle: 'De la consommation globale',
            root: false,
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