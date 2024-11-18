import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatDatepickerInputEvent, MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';

import { ToolService } from '../tool.service';
import { UtilityService } from  './util.service';
import { ToolRentalAgreement } from '../models/tool-rental.interface';
import { Tool } from '../models/tool.interface';
import { ToolCharge } from '../models/tool-charge.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRentalComponent } from './dialog-new-rental-confirm/dialog-new-rental.component';

const  TODAY = new Date();

@Component({
  selector: 'app-new-rental',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatGridList,
    MatGridTile,
    MatDatepickerModule,
    MatButton
  ],
  providers: [ UtilityService ],
  templateUrl: './new-rental.component.html',
  styleUrl: './new-rental.component.css'
})

export class NewRentalComponent {
  toolService = inject(ToolService);

  Tools: Tool[] = [];
  Charges: ToolCharge[] = [];

  form: FormGroup;
  selectedTool!: Tool | undefined;
  newRental!: ToolRentalAgreement;
  formErrors!: string[];

  datePipe = new DatePipe('en-US');
  currencyPipe = new CurrencyPipe('en-US');
  percentPipe = new PercentPipe('en-US');
 
  constructor(
    private utilService: UtilityService,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.toolService.getToolCharges_Promise().then((toolCharges: ToolCharge[]) => {
      this.Charges = toolCharges;
    });
    this.toolService.getTools_Promise().then((tools: Tool[]) => {
      this.Tools = tools;
    });

    this.form = this.fb.group({
      tool: new FormControl('', [Validators.required]),
      checkoutDate: new FormControl('', [Validators.required]),
      returnDate: new FormControl('', [Validators.required]),
      discountPercent: new FormControl('', [Validators.pattern('^[1-9][0-9]?$')]),
    });

    this.newRental = {
      toolCode: '',
      checkoutDate: Date().toString(),
      returnDate: Date().toString(),
      discountPercent: 0,
      chargeableDays: 0,
      dailyCharge: 0,
      prediscountAmount: 0,
      discountAmount: 0,
      finalAmount: 0
    }
  }

  onToolChange(tool: Tool) {
    // load charges for the tool
    this.selectedTool = tool;
    this.newRental.toolCode = tool.code;
    this.newRental.toolBrand = tool.brand;
    this.newRental.toolType = tool.type;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    // check it's equal or greater than TODAY
    // validate return date is equal or greater than checkout date
   
    // raise error 
    this.formErrors = this.validateForm();
  }

  validateControl(form: FormGroup, controlName: string, errorName?: string) {
    if (errorName)
      return form.controls[controlName].hasError(errorName);
    else
      return form.controls[controlName].invalid;
  }

  private validateForm() {
    const checkoutDate = moment(this.form.value.checkoutDate);
    const returnDate = moment(this.form.value.returnDate);

    const errors = [];
    if (checkoutDate.isBefore(TODAY, 'day')) errors.push('Checkout Date is before TODAY.');
    if (returnDate.isBefore(TODAY, 'day')) errors.push('Return Date is before TODAY.');
    if (returnDate.isBefore(checkoutDate, 'day')) errors.push('Return Date is before Checkout Date.');

    return errors;
  }

  onSubmit() {
    if (this.form.valid) {
      const errors = this.validateForm();
      if (errors.length) {
        alert(errors.join(' '));
        return;
      }

      this.getNewRentalAgreement();
      this.openConfirmDialog();
    }
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(DialogNewRentalComponent, {
      width: '500px',
      data: { 
        title: 'New Tool Rental Confirmation', 
        newRental: this.newRental 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.toolService.addNewToolRental(this.newRental);
        this.goHome();
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  private isChargeableDay(charge: ToolCharge | undefined, date: Date) {
    const isWeekend = this.utilService.isWeekend(date); 
    const isWeekday = !isWeekend;
    const isHoliday = this.utilService.isHoliday(date); 
    const isChargeableDay = (isHoliday && charge?.holidayCharge) || 
      (isWeekend && charge?.weekendCharge) || 
      (isWeekday && charge?.weekdayCharge);

    return isChargeableDay;
  }

  //  Calculated using checkout date and return date, excluding “no charge” days as specified by the tool type
  private getChargeableDays(tool: Tool, checkoutDate: Date, returnDate: Date): number {
    const charge = this.getChargeForTool(tool);
    let chargeableDays = 0;
    let currentDate = new Date(checkoutDate);
    while (currentDate <= returnDate) {
      const isChargeableDay = this.isChargeableDay(charge, currentDate);
      if (isChargeableDay) {
        chargeableDays = chargeableDays + 1;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chargeableDays;
  }

  private getChargeForTool(tool: Tool): ToolCharge | undefined {
    return this.Charges.find((charge: ToolCharge) => charge.type === tool.type);
  }

  private getNewRentalAgreement() {
    const tool = this.form.value.tool;
    const checkoutDate = this.form.value['checkoutDate']; 
    const returnDate = this.form.value['returnDate'];
    const chargeableDays = this.getChargeableDays(tool, checkoutDate, returnDate);
    const charge = this.getChargeForTool(tool);
    const dailyCharge = charge?.dailyCharge || 0;
    const discount = this.form.value['discountPercent'] || 0;
    const discountPercent = discount / 100;
    const prediscountAmount = chargeableDays * dailyCharge;
    const discountAmount = discountPercent * prediscountAmount;
    const finalAmount = prediscountAmount - discountAmount;

    this.newRental = {
      toolCode: tool.code,
      toolType: tool.type,
      toolBrand: tool.brand,
      checkoutDate: checkoutDate,
      returnDate: returnDate,
      discountPercent: discountPercent,         
      dailyCharge: dailyCharge,
      chargeableDays: chargeableDays,
      prediscountAmount: this.utilService.formatCurrency(prediscountAmount),  
      discountAmount: this.utilService.formatCurrency(discountAmount),  
      finalAmount: this.utilService.formatCurrency(finalAmount)  
    }
  }
}
