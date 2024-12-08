import { PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      return { data: value, errors: parsed.error.flatten().fieldErrors };
    }

    return { data: parsed.data };
  }
}
