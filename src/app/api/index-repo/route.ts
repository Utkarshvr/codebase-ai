import { indexRepository } from "@/src/lib/indexer";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await indexRepository("Utkarshvr", "shipment-rate-api");

  return NextResponse.json(result);
}
