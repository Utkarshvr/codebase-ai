import { qdrant } from "@/src/lib/qdrant";
import { createEmbedding } from "@/src/lib/embeddings";
import { NextResponse } from "next/server";

export async function GET() {
  const question = "Where do we check the user's password?";

  const queryVector = (await createEmbedding(question)) as number[];

  const results = await qdrant.query("code_chunks", {
    query: queryVector,
    limit: 3,
    with_payload: true,
  });

  return NextResponse.json(results);
}
