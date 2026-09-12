import { getRepositoryFiles } from "./github";
import { chunkCode } from "./chunker";
import { createEmbedding } from "./embeddings";
import { qdrant } from "./qdrant";

export async function indexRepository(owner: string, repo: string) {
  const files = await getRepositoryFiles(owner, repo);

  const points: {
    id: string;
    vector: any[];
    payload: {
      repo: string;
      file: string;
      startLine: number;
      endLine: number;
      code: string;
    };
  }[] = [];

  for (const file of files) {
    const chunks = chunkCode(file.code);

    for (const chunk of chunks) {
      const vector = await createEmbedding(chunk.code);

      points.push({
        id: crypto.randomUUID(),
        vector,
        payload: {
          repo: `${owner}/${repo}`,
          file: file.path,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          code: chunk.code,
        },
      });
    }
  }

  await qdrant.upsert("code_chunks", {
    wait: true,
    points,
  });

  return {
    files: files.length,
    chunks: points.length,
  };
}
