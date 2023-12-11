import * as z from "zod"

export const userAuthSchema = z.object({
  name: z.string().min(5, {
    message: "Username minimal harus terdiri dari 5 karakter"
  }),
  password: z.string().min(3, {
    message: "Password minimal harus terdiri dari 3 karakter"
  }),
})