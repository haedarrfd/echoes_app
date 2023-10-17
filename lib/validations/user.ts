import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Minimum 3 Characters" })
    .max(50, { message: "Maximum 50 Characters" }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 Characters" })
    .max(30, { message: "Maximum 30 Characters" }),
  bio: z
    .string()
    .min(10, { message: "Minimum 10 Characters" })
    .max(1000, { message: "Maximum 1000 Characters" }),
});
