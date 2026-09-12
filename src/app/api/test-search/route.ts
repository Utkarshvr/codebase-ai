import { NextResponse } from "next/server";
import { searchCode } from "@/src/lib/search";

export async function GET() {
  const results = await searchCode(
    "How is the shipping rate calculated?",
    "Utkarshvr/shipment-rate-api",
    5,
    0.2,
  );

  return NextResponse.json(results);
}
