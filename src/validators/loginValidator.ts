import { z } from "zod";

const loginValidator = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string(),
});

export default loginValidator;
