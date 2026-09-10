import { NextResponse } from "next/server";
import { searchCode } from "@/src/lib/search";

export async function GET() {
  const results = await searchCode("Where do we check the user's password?");

  return NextResponse.json(results);
}
