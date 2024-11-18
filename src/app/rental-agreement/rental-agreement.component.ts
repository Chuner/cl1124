import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
//import { provideNativeDateAdapter } from '@angular/material/core';
import { ToolRentalAgreement } from '../models/tool-rental.interface';

@Component({
  selector: 'app-rental-agreement',
  standalone: true,
  imports: [
    CommonModule,
    MatGridList,
    MatGridTile,
  ],
  //providers: [ provideNativeDateAdapter()],
  templateUrl: './rental-agreement.component.html',
  styleUrl: './rental-agreement.component.css'
})
export class RentalAgreementComponent {
  @Input() rentalAgreement!: ToolRentalAgreement;
}
