export type HttpMethod = "POST" | "PUT" | "PATCH";

export interface PurchaseTransactionPayload {
  business_id: number;
  customer_id: number;
  payment_id: number;
  user_id: number;
  transaction_amount: number;
  transaction_hour: number;
  is_proxy: boolean;
  distance_home_shipping: number;
  avg_monthly_spend: number;
  previous_frauds: number;
  device_type: string;
  browser: string;
  country_ip: string;
  card_type: string;
  payment_method: string;
  card_country: string;
  business_country: string;
}


