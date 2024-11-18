import { Injectable } from '@angular/core';
// import moment from 'moment';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private adjustTimeZone(date: Date) {
    const diff = date.getTimezoneOffset()
    date.setHours(date.getHours() + diff/60);
    return date;
  }

  isLaborDay(date: Date): boolean {
    const useDate = this.adjustTimeZone(date);
    if (useDate.getMonth() === 8) {
      if (useDate.getDate() <= 7 && useDate.getDay() === 1) { // 1 is Monday
        return true;
      }
    }

    return false;
  }

  // Independence Day - July 4th (observed on the closest weekday if it falls on a weekend)
  isObservedJuly4th(date: Date) {
    const useDate = this.adjustTimeZone(date);
    const year = new Date(useDate).getFullYear();
    const july4thDay = this.adjustTimeZone(new Date(year, 6, 4));
    let observedDay = 4;

    if (this.isSaturday(july4thDay)) observedDay = observedDay - 1; 
    if (this.isSunday(july4thDay)) observedDay = observedDay + 1

    return useDate.getMonth() === 6 && useDate.getDate() === observedDay;
  }

  isHoliday(date: Date): boolean {
    return this.isObservedJuly4th(date) || this.isLaborDay(date);
  }

  isSaturday(date: Date) {
    const useDate = this.adjustTimeZone(date);
    return useDate.getDay() === 6;
  }

  isSunday(date: Date) {
    const useDate = this.adjustTimeZone(date);
    return useDate.getDay() === 0;
  }

  isWeekend(date: Date): boolean {
    return this.isSaturday(date) || this.isSunday(date); 
  }

  formatCurrency(number: number) {
    return Math.round(number * 100) / 100
  }

  formatDate(date: Date) {
    const useDate = moment(date);
    return useDate.format('mm/dd/yy');
  }
}


