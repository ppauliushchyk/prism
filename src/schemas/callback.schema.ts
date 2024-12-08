import { z } from "zod";

export const createCallbackSchema = z
  .object({ id: z.string().uuid(), status: z.string() })
  .passthrough();

export type CreateCallbackDto = z.infer<typeof createCallbackSchema>;
