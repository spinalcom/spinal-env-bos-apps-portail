
export default {
    config: [
        {
            title: "Consommation d'énergie globale", // titre affiché dans le sélecteur
            label: "Consommation",
            labelIndicators: "consommés", // String affiché dans les 3 petites cartes sous le graph 
            source: {
                building: {
                    profileName: "KPI USI", // nom du controlendpoint / profile name associé au bâtiment pour ce sélecteur
                    name: "Energie globale" // nom du endpoint associé au batiment pour ce sélecteur
                },
                floors: {
                    profileName: "KPI USI", // nom du controlendpoint / profile name pour l'étage
                    name: "Energie globale" // nom du endpoint pour l'étage
                }
            },
            unit: "kWh", // unité
            color: "#14202C" // => couleur de la chip dans le sélecteur
        },
        {
            title: "Consommation d'éclairage",
            label: "Consommation",
            labelIndicators: "consommés",
            source: {
                building: {
                    profileName: "KPI USI",
                    name: "Eclairage"
                },
                floors: {
                    profileName: "KPI USI",
                    name: "Eclairage"
                }
            },
            unit: "kWh",
            color: "#FFFF00"
        },
        {
            title: "Consommation d'eau",
            label: "Consommation",
            labelIndicators: "consommés",
            source: {
                building: {
                    profileName: "KPI USI",
                    name: "Eau globale"
                },
                floors: {
                    profileName: "KPI USI",
                    name: "Eau sanitaire"
                }
            },
            unit: "L",
            color: "#0000FF"
        }
    ]





    // title: 'Consommation Eau globale',
    // label: 'Consommation',
    // labelIndicators:"consommés",
    // buildingApiUrl: "Eau globale",
    // floorApiUrl: "Eau sanitaire",
    // unit:'L',
    // color:'#14202c',


    // exemple: {
    //   title: 'Consommation d\'eau sanitaire',
    //   label: 'Consommation',
    //   labelIndicators:"consommé",
    //   apiUrl: 'Eau globale',
    //   unit:'L',
    // },
}
