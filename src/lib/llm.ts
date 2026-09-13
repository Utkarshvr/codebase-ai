import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAnswer(question: string, context: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an AI codebase assistant.

Answer the user's question using ONLY the provided code context.
If the context does not contain enough information, say so.

Be concise and mention relevant file names and line numbers when possible.
        `,
      },
      {
        role: "user",
        content: `
Question:
${question}

Code context:
${context}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}
