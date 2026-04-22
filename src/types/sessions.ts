export interface Sessions {
  id: string;
  startTime: Date;
  endTime: Date | null;
  totalCost: number | null;
  userId: string;
  zoneId: string;
  plateNumberId: string;
}
