import { color } from "chart.js/helpers";

export default function getIcon(file_name: string): { name: string, color: string } {
    const ext = file_name.replace(/.*\./, '');

    switch (ext) {
        case 'pdf':
            return {
                name: 'mdi-file-pdf-box',
                color: '#FF5722'
            
            };
          case 'xlsx':
          case 'xls':
          case 'csv':
            return {
                name:'mdi-file-excel-box',
                color: '#207245'
            };
          case 'jpg':
          case 'jpeg':
            return {
                name: 'mdi-file-jpg-box',
                color: '#3F51B5'
            };
          case 'png':
            return {
                name:'mdi-file-png-box',
                color: '#14202C'
            };
          case 'mp4':
          case 'avi':
          case 'webm':
            return {
                name:'mdi-movie-outline',
                color: '#6B9EEF'
            };
          default:
            return {
                name:'mdi-file', color: '#14202C'};
    }
}
