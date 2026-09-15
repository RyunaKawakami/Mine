"use server";

import { signOut } from "@/auth";

export async function signOutFromMine(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
