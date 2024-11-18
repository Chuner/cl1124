import { Injectable } from '@angular/core';
import { ToolRentalAgreement } from './models/tool-rental.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToolCharge } from './models/tool-charge.interface';
import { Tool } from './models/tool.interface';

const storageKey = 'tool-rentals';

@Injectable({
  providedIn: 'root'
})

export class ToolService {

  private toolRentalList:ToolRentalAgreement[] = [
    {
      "toolCode": "JAKD",
      "toolType": "jackhammer",
      "toolBrand": "DeWalt",
      "checkoutDate": "2024-11-18T13:33:36.875Z",
      "returnDate": "2024-11-18T13:33:36.875Z",
      "discountPercent": 0,
      "dailyCharge": 2.99,
      "chargeableDays": 1,
      "prediscountAmount": 2.99,
      "discountAmount": 0,
      "finalAmount": 2.99
    }
  ];

  constructor(
    private http: HttpClient
  ) {
  }

  getToolCharges(): Observable<ToolCharge[]> {
    return this.http.get<ToolCharge[]>('/assets/charges.json');
  } 

  async getToolCharges_Promise(): Promise<ToolCharge[]> {
    const data = await fetch('/assets/charges.json');
    return (await data.json()) ?? [];
  }

  getTools(): Observable<Tool[]> {
    return this.http.get<Tool[]>('/assets/tools.json');
  } 

  async getTools_Promise(): Promise<Tool[]> {
    const data = await fetch('/assets/tools.json');
    return (await data.json()) ?? [];
  }

  getToolRentalList_http(): Observable<ToolRentalAgreement[]> {
    return this.http.get<ToolRentalAgreement[]>('/assets/rentals.json');
  } 

  getToolRentalList(): Observable<ToolRentalAgreement[]> {
    return of(this.toolRentalList);
  } 

  addNewToolRental(rental: ToolRentalAgreement) {
    this.toolRentalList.push(rental);
  }
}
