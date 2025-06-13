// Type pour les objets source
interface Source {
    building: {
      profileName: string;
      name: string;
    };
    floor: {
      profileName: string;
      name: string;
    };
  }
  
  // Type pour les objets `controlEndpoints`
  export interface ControlEndpoint {
    title: string;
    subtitle: string;
    label: string;
    min: number | null;
    max: number | null;
    name: string;
    color: string;
    unit: string;
    stackGroup: string;
    source: Source;
    averageTitle: string;
    averageSubtitle: string;
    totalTitle: string;
    totalSubtitle: string;
    root: boolean;
    todayTitle?: string; // Propriété optionnelle
  }
  
  // Interface principale pour `config`
  export interface Config {
    chart: string;
    unit: string;
    calendarLegend: string;
    monthStripeLegend: string;
    compareBy: string;
    todaysCardTitle: string;
    todaysCardSubtitle: string;
    averageCardTitle: string;
    averageCardSubtitle: string;
    totalCardTitle: string;
    totalCardSubtitle: string;
    controlEndpoints: ControlEndpoint[];
    cards: ('total' | 'average' | 'today')[];
  }
  
  