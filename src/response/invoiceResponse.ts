import { z } from "zod";

export const paymentStatusEnum = z.enum([
  "paid",
  "pending",
  "partial",
  "overdue",
  "cancelled",
]);

export const invoiceItemSchema = z.object({
  invoice_id: z.uuid({ message: "Invalid invoice ID format" }),
  invoice_number: z.string({ message: "Invalid invoice number format" }),
  issue_date: z.string({ message: "Invalid issue date format" }),
  due_date: z.string({ message: "Invalid due date format" }),
  total: z.number().nonnegative({ message: "Total must be non-negative" }),
  amount_paid: z.number().min(0, { message: "Amount paid must be >= 0" }),
  payment_status: paymentStatusEnum,
  voided_at: z.string().nullable(),
});

export const invoiceResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.array(invoiceItemSchema),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
