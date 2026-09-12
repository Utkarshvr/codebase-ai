// app/api/setup/route.ts

import { qdrant } from "@/src/lib/qdrant";
import { NextResponse } from "next/server";

export async function GET() {
  await qdrant.createPayloadIndex("code_chunks", {
    field_name: "repo",
    field_schema: "keyword",
  });

  // await qdrant.createCollection("code_chunks", {
  //   vectors: {
  //     size: 384,
  //     distance: "Cosine",
  //   },
  // });

  return NextResponse.json({ success: true });
}
