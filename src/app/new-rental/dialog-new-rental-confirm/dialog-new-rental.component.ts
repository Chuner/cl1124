import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RentalAgreementComponent } from '../../rental-agreement/rental-agreement.component';

@Component({
  selector: 'app-dialog-new-rental',
  standalone: true,
  imports: [MatDialogModule, MatButton, RentalAgreementComponent],
  templateUrl: './dialog-new-rental.component.html',
  styleUrl: './dialog-new-rental.component.css'
})
export class DialogNewRentalComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogNewRentalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data.newRental)
  }

  confirm(): void {
    this.dialogRef.close({
      confirmed: true
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
