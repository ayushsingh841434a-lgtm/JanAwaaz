import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST() {
  const res = ok({ loggedOut: true });
  clearAuthCookie(res);
  return res;
}
