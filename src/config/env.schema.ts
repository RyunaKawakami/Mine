import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.url().optional(),
);

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  AUTH_URL: optionalUrl,
  AUTH_SECRET: optionalSecret,
  AUTH_GOOGLE_ID: optionalSecret,
  AUTH_GOOGLE_SECRET: optionalSecret,
  DATABASE_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .regex(/^postgres(?:ql)?:\/\//, "PostgreSQL connection URL is required")
      .optional(),
  ),
  BLOB_READ_WRITE_TOKEN: optionalSecret,
  MINE_ALBUM_SLUG: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().trim().min(1).max(64).optional(),
    )
    .default("mine"),
  MINE_ALLOWED_EMAILS: z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().optional(),
    )
    .transform((value) =>
      value
        ? [
            ...new Set(
              value.split(",").map((email) => email.trim().toLowerCase()),
            ),
          ]
            .filter(Boolean)
            .map((email) => z.email().parse(email))
        : [],
    ),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  environment: Record<string, string | undefined>,
): ServerEnv {
  return serverEnvSchema.parse(environment);
}
