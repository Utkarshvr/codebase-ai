import { searchCode } from "./search";
import { generateAnswer } from "./llm";

export async function askCodebase(question: string, repo: string) {
  const results = await searchCode(question, repo, 5, 0.2);

  if (results.length === 0) {
    return "I couldn't find relevant code for this question.";
  }

  const context = results
    .map((result) => {
      const payload = result.payload as any;

      return `
File: ${payload.file}
Lines: ${payload.startLine}-${payload.endLine}

${payload.code}
`;
    })
    .join("\n---\n");

  return generateAnswer(question, context);
}
