import { qdrant } from "./qdrant";
import { createEmbedding } from "./embeddings";

export async function searchCode(question: string, limit = 5) {
  const queryVector = (await createEmbedding(question)) as number[];

  const results = await qdrant.query("code_chunks", {
    query: queryVector,
    limit,
    with_payload: true,
  });

  return results.points;
}
