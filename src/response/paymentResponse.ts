import { z } from "zod";

export const paymentSchema = z.object({
  payment_date: z.uuid({ message: "Invalid payment date format" }),
  amount_paid: z.number().min(0, { message: "Amount paid must be >= 0" }),
  proof_of_transfer: z.string({ message: "Invalid proof of transfer format" }),
  total: z.number().nonnegative({ message: "Total must be non-negative" }),
});

export const paymentResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.array(paymentSchema),
});

export type Payment = z.infer<typeof paymentSchema>;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
