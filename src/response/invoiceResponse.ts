import { z } from "zod";

export const paymentStatusEnum = z.enum([
  "paid",
  "pending",
  "partial",
  "overdue",
  "cancelled",
]);

export const invoiceItemSchema = z.object({
  InvoiceID: z.string().uuid({ message: "Invalid invoice ID format" }),
  IssueDate: z.string({ message: "Invalid issue date format" }),
  DueDate: z.string({ message: "Invalid due date format" }),
  Total: z.number().nonnegative({ message: "Total must be non-negative" }),
  AmountPaid: z.number().min(0, { message: "Amount paid must be >= 0" }),
  PaymentStatus: paymentStatusEnum,
});

export const invoiceResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.array(invoiceItemSchema),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
