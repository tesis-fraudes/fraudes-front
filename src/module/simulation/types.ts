export type HttpMethod = "POST" | "PUT" | "PATCH";

export interface PurchaseTransactionPayload {
  business_id?: number | null;
  customer_id?: number | null;
  payment_id?: number | null;
  user_id?: number | null;
  transaction_amount?: number | null;
  transaction_hour?: number | null;
  is_proxy?: boolean | null;
  distance_home_shipping?: number | null;
  avg_monthly_spend?: number | null;
  previous_frauds?: number | null;
  device_type?: string | null;
  browser?: string | null;
  country_ip?: string | null;
  card_type?: string | null;
  payment_method?: string | null;
  card_country?: string | null;
  business_country?: string | null;
}


