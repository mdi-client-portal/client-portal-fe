export interface InvoiceExtendedResponse {
  invoice_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  tax_amount: number;
  sub_total: number;
  total: number;
  tax_invoice_number: string;
  amount_paid: number;
  payment_status: string;
  voided_at: string;
}

export interface InvoiceDetailResponse {
  invoice_detail_id: string;
  invoice_id: string;
  amount: number;
  created_at: string;
  price_per_delivery: number;
  transaction_note: string;
  updated_at: string;
  delivery_count: number;
  deleted_at: string;
}

export interface InvoiceWithDetailResponse {
  invoice: InvoiceExtendedResponse;
  invoice_details: InvoiceDetailResponse[];
}
