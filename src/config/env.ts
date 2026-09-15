import "server-only";

import { parseServerEnv } from "@/config/env.schema";

export const env = parseServerEnv(process.env);
