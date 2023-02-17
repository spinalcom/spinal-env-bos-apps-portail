/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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


export const groups = [
    { id: 1, name: "Bilan" },
    { id: 2, name: "Temps Réel" },
    { id: 3, name: "Pilotage" },
    { id: 4, name: "Prévision" },
];

export const categories = [
    {
        name: "Découverte",
        1: [{ name: "découverte", icon: "mdi-magnify", description: "description", tags: ["3d"] }],
        4: [
            { name: "occupation", icon: "mdi-fire", description: "description", tags: ["Heatmap", "3d"] },
            { name: "réservation", icon: "mdi-calendar-weekend", description: "description", tags: ["Heatmap", "calendar"] }
        ],
    },
    {
        name: "Energie",
        2: [
            { name: "occupation", icon: "mdi-fire", description: "description", tags: ["Heatmap", "3d"] },
            { name: "réservation", icon: "mdi-calendar-weekend", description: "description", tags: ["Heatmap", "calendar"] }
        ],
        1: [
            { name: "occupation", icon: "mdi-fire", description: "description", tags: ["Heatmap", "3d"] },
            { name: "réservation", icon: "mdi-calendar-weekend", description: "description", tags: ["Heatmap", "calendar"] }
        ],
        3: [
            { name: "occupation", icon: "mdi-fire", description: "description", tags: ["Heatmap", "3d"] },
            { name: "réservation", icon: "mdi-calendar-weekend", description: "description", tags: ["Heatmap", "calendar"] }
        ],
    }
]