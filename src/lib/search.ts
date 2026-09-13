import { qdrant } from "./qdrant";
import { createEmbedding } from "./embeddings";

export async function repoExistsInQdrant(repo: string): Promise<boolean> {
  const result = await qdrant.count("code_chunks", {
    filter: {
      must: [
        {
          key: "repo",
          match: { value: repo },
        },
      ],
    },
    exact: true,
  });

  return result.count > 0;
}

// export async function searchCode(question: string, limit = 5) {
//   const queryVector = (await createEmbedding(question)) as number[];

//   const results = await qdrant.query("code_chunks", {
//     query: queryVector,
//     limit,
//     with_payload: true,
//   });

//   return results.points;
// }

export async function searchCode(
  question: string,
  repo: string,
  limit = 5,
  minScore = 0,
) {
  const queryVector = (await createEmbedding(question)) as number[];

  const results = await qdrant.query("code_chunks", {
    query: queryVector,
    limit,
    with_payload: true,
    filter: {
      must: [
        {
          key: "repo",
          match: {
            value: repo,
          },
        },
      ],
    },
  });

  return results.points.filter((point) => point.score >= minScore);
}
