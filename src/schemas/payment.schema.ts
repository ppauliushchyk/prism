import { z } from "zod";

import { validate } from "../utils/card-number";

export const createPaymentSchema = z
  .object({
    amount: z.coerce.number().gt(0),
    cc_cvv: z.string().regex(/^\d{3}$/),
    cc_expiration: z.string().regex(/^\d{2}\/\d{2}$/),
    cc_name: z.string().min(1),
    cc_number: z
      .string()
      .min(1)
      .transform((value) => value.replaceAll(/[ -]/g, ""))
      .refine((value) => value.match(/^[0-9]{13,19}$/))
      .refine((value) => validate(value)),
    currency: z.enum(["EUR", "USD"]),
  })
  .required();

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
