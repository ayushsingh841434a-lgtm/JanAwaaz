import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: string, status = 400, extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ success: false, error, ...extra }, { status });
}

export function zodError(e: ZodError): NextResponse {
  const first = e.issues[0];
  return fail(first ? `${first.path.join(".")}: ${first.message}` : "Invalid input", 422);
}

/** Parse a JSON body safely; returns null on invalid JSON. */
export async function parseJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
