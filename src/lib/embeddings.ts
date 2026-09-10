// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function createEmbedding(text: string) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });

//   return response.data[0].embedding;
// }

import { pipeline } from "@huggingface/transformers";

let extractor;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  return extractor;
}

export async function createEmbedding(text: string) {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}
