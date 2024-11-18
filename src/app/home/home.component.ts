import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ToolService } from '../tool.service';
import { RentalAgreementComponent } from '../rental-agreement/rental-agreement.component';
import { ToolRentalAgreement } from '../models/tool-rental.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RentalAgreementComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  rentalList: ToolRentalAgreement[] = [];
  toolService = inject(ToolService);
  constructor() {
    this.toolService.getToolRentalList().subscribe((resp: any) => {
      if (resp) this.rentalList = resp;
    });
  }
}
