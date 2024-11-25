import { TestBed } from '@angular/core/testing';

import { UtilityService } from './util.service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should determine if a date is observed July 4th", () => {
    expect(service.isObservedJuly4th(new Date(2023, 6, 4))).toBe(true); // July 4th, 2023
    expect(service.isObservedJuly4th(new Date(2021, 6, 5))).toBe(true); // July 4th, 2021, Sunday
    expect(service.isObservedJuly4th(new Date(2020, 6, 3))).toBe(true); // July 4th, 2021, Saturday
    expect(service.isObservedJuly4th(new Date(2023, 6, 5))).toBe(false); // Not July 4th
  });

  it("should determine if a date is Labor Day", () => {
    expect(service.isLaborDay(new Date('2024-09-02'))).toBe(true); // Labor Day, 2024
    expect(service.isLaborDay(new Date('2023-09-04'))).toBe(true); // Labor Day, 2023
    expect(service.isLaborDay(new Date('2024-09-01'))).toBe(false); // Not Labor Day
  });

  // 9/3/15 Thu 9/4 Fri week day   2
  // 9/5 9/6 weekend 0
  // 9/7 Labor day 0
  // 9/8 9/9 weekday  2
  // 4 charge days with no discount = 4 x 2.99 = 11.96
  // FAILED - 3 chargeable days?
  it("Test #4", () => {
    expect(!service.isWeekend(new Date('9/3/15'))).toBe(true); 
    expect(!service.isWeekend(new Date('9/4/15'))).toBe(true); 
    expect(service.isWeekend(new Date('9/5/15'))).toBe(true); 
    expect(service.isWeekend(new Date('9/6/15'))).toBe(true); 
    expect(service.isLaborDay(new Date('9/7/15'))).toBe(true);
    expect(!service.isWeekend(new Date('9/8/15'))).toBe(true); 
    expect(!service.isWeekend(new Date('9/9/15'))).toBe(true);  
  });
});
