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
});
