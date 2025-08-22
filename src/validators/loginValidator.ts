import { z } from "zod";

export const loginValidatorSchema = z.object({
  email: z.email({ pattern: z.regexes.unicodeEmail }),
  password: z.string().min(8, { message: "password atleast 8 character" }),
});

export type LoginValidator = z.infer<typeof loginValidatorSchema>;
