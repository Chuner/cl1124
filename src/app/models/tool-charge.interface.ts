export interface ToolCharge {
  type: string;
  dailyCharge: number;
  weekdayCharge?: boolean;
  weekendCharge?: boolean;
  holidayCharge?: boolean;
}
