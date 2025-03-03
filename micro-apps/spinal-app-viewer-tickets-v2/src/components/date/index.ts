export function displayDate(dateTime: number) {
    const date = new Date(dateTime);
  
    let day = "" + date.getDate(),
      month = "" + (date.getMonth() + 1);
    const year = "" + date.getFullYear();
  
    if (day.length == 1) day = "0" + day;
    if (month.length == 1) month = "0" + month;
  
    return `${day}/${month}/${year}`;
  }
  
  export function compareDate(date1: any, date2: any) {
    const e1 = date1.split("/") as number[];
    const e2 = date2.split("/") as number[];
    return e1[2] - e2[2] || e1[1] - e2[1] || e1[0] - e2[0];
  }