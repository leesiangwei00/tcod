import { z } from "zod";

export type ZodConfig = {
  type: "number";
  message?: string;
  default?: number;
  min?: { value?: number; message?: string };
  max?: { value?: number; message?: string };
  step?: number;
  disabled?: boolean;
  optional?: boolean;
};

export const config = (config?: ZodConfig) => {
  const type = config?.type;
  const min = config?.min;
  const max = config?.max;
  const optional = config?.optional;

  if (type === "number") {
    let schema: any = z.number({
      message: config?.message || "Please enter a valid number",
    });

    if (min) {
      schema = schema.min(min.value, {
        message: min.message,
      });
    }

    if (max) {
      schema = schema.max(max.value, {
        message: max.message,
      });
    }

    if (optional) {
      schema = schema.optional();
    }

    return z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, schema);
  } else {
    return z.string();
  }
};
