import { z } from "zod";

export const paymentStatusEnum = z.enum([
  "PAID",
  "PENDING",
  "OVERDUE",
  "CANCELLED",
]);

export const invoiceResponseSchema = z
  .object({
    invoice_id: z.uuid({ message: "Invalid invoice ID format" }),
    issue_date: z.iso.datetime({ message: "Invalid issue date format" }),
    due_date: z.iso.datetime({ message: "Invalid due date format" }),
    total: z.number().nonnegative({ message: "Total must be non-negative" }),
    amount_paid: z.number().min(0, { message: "Amount paid must be >= 0" }),
    payment_status: paymentStatusEnum,
  })
  .strict();

export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
