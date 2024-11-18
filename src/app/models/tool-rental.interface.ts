export interface ToolRentalAgreement {
  toolCode: string;
  toolBrand?: string,
  toolType?: string,
  checkoutDate: string,
  returnDate: string,
  discountPercent: number,
  chargeableDays: number,
  dailyCharge: number,
  prediscountAmount: number,
  discountAmount: number,
  finalAmount: number
}
