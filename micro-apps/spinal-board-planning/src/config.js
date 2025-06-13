
export default {
  config: {
    similarSteps: [
      [0, 5, 7],
      [3, 6, 11],
    ],
    firstPriority: [0, 1, 2, 5, 7, 8],
    lastPriority: [3, 4, 6, 10, 11],
    starts: [2, 5, 7, 12],
    ends: [3, 6, 11, 13],
    workflow: [
      {
        name: 'Demande d\'intervention',
        steps: [
          {
            id: 0,
            name: 'Attente de lect.avant Execution',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 1,
            name: 'Attente de réalisation',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 2,
            name: 'Réalisation partielle',
            icon: 'mdi-progress-helper',
            defaultColor: '#c4c4c4',
          },
          {
            id: 3,
            name: 'Clôturée',
            icon: 'mdi-check-circle',
            defaultColor: '#c4c4c4',
          },
          {
            id: 4,
            name: 'Refusée',
            icon: 'mdi-close-circle',
            defaultColor: '#c4c4c4',
          },
        ],
      },
      {
        name: 'Tickets Otis',
        steps: [
          {
            id: 5,
            name: 'Raised',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 6,
            name: 'Solved',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
        ],
      },
      {
        name: 'Log list',
        steps: [
          {
            id: 7,
            name: 'first',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 8,
            name: 'second',
            icon: 'mdi-dots-horizontal-circle-outline',
            defaultColor: '#4caf50',
          },
          {
            id: 9,
            name: 'third',
            icon: 'mdi-adjust',
            defaultColor: '#c4c4c4',
          },
          {
            id: 10,
            name: 'fourth',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 11,
            name: 'last',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
        ],
      },
      {
        name: 'Gantt dashboard',
        steps: [
          {
            id: 12,
            name: 'Attente de lect.avant Execution',
            icon: 'mdi-clock',
            defaultColor: '#c4c4c4',
          },
          {
            id: 13,
            name: 'Clôturée',
            icon: 'mdi-check-circle',
            defaultColor: '#c4c4c4',
          },
        ],
      },
    ],
  },
}

