import { IConfig } from "./src/interfaces/IConfig";


// export const  config: IConfig = {
//     context: 'Gestion des équipements',
//     category: 'Typologie',
//     groupEquipement: 'Multicapteurs',
//     profileName: 'multicapteur commisonning',
//     attributs: {
//         categoryAttribute: 'GTB',
//         label: 'convention nommage',
//         conventionName: /^AUT-\d{3}-MCA-\d{3}$/
//     },
//     sources : [
//         {
//             name: 'Taux de disponibilité',
//             unit: '%',
//         },
//         {
//             name: 'Taux de données en défaut reçues',
//             unit: '%',
//         },
//         {
//             name: 'Taux de données exploitables',
//             unit: '%',
//         }
//     ]


// }


export const  config: IConfig = {
    entryPoint:{
        context: "Gestion des équipements",
        category: "Typologie",
        group: "Multicapteurs",
        type: "equipement" // | equipments
    },
    sources:[
        {
            id: 1,
            type: "attribute",
            categoryName: "GTB",
            name: "Convention nommage",
            unit: "",
            
        },
        {
            id: 2,
            type: "controlPoint",
            profileName: "multicapteur commisonning",
            name: "Taux de disponibilité",
            unit: "%",
            legend: {
                min: { value: 12, color: "#24CBD9" },
                median: { value: 37, color: "#2077CE"},
                max: { value: 75, color: "#112C9D" },
            },
        },
        {
            id: 3,
            type: "controlPoint",
            profileName: "multicapteur commisonning",
            name: "Taux de données en défaut reçues",
            unit: "%",
            legend:{
                min: { value: 12, color: "#24CBD9" },
                median: { value: 37, color: "#2077CE" },
                max: { value: 75, color: "#112C9D" },
            }
        },
        {
            id: 4,
            type: "controlPoint",
            profileName: "multicapteur commisonning",
            name: "Taux de données exploitables",
            unit: "%",
            legend:{
                min: { value: 12, color: "#24CBD9" },
                median: { value: 37, color: "#2077CE" },
                max: { value: 75, color: "#112C9D" },
            }
        }
    ],
    bilan: {
        timeline: {
            sourceId: 1,
            setup:{
                type: "regex",
                value: "/^AUT-\\d{3}-MCA-\\d{3}$/",
                legend: [
                    { name: 'correspond', color: '#14202C',   type: "success"},
                    { name: 'incorrect',  color: '#FF000B', type: "warning" },
                    { name: 'non défini', color: '#9830F2', type: "missing" },
                    { name: 'doublons', color: '#EF8BC5',  type: "dual" },



                ]
            }
        },
        // dotsGrid: {
        //     sourceId: 4,
        //     setup:{
        //         type: "threshold_below",
        //         value: 70,
        //     }
        // }

    }
}