import { NextResponse } from "next/server";

// The MVP demo uses a browser-local session. Keep this pass-through proxy so
// real Auth.js protection can be restored later without changing route files.
export function proxy() {
  return NextResponse.next();
}
