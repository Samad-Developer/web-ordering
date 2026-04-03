export type OrderStatusLog = {
  Id: number;
  CreatedAt: string;
};

export type OrderStatusTrackerProps = {
  initialStatus: string;
  orderToken: string;
  initialLogs?: OrderStatusLog[];
};