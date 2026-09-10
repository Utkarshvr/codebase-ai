import { qdrant } from "@/src/lib/qdrant";
import { createEmbedding } from "@/src/lib/embeddings";
import { NextResponse } from "next/server";

export async function GET() {
  const code = `
    async function loginUser(email, password) {
      const user = await findUserByEmail(email);
      return bcrypt.compare(password, user.passwordHash);
    }
  `;

  const vector = await createEmbedding(code);

  await qdrant.upsert("code_chunks", {
    wait: true,
    points: [
      {
        id: 1,
        vector: vector as number[],
        payload: {
          file: "auth/login.ts",
          language: "typescript",
          type: "function",
          name: "loginUser",
          code,
        },
      },
    ],
  });

  return NextResponse.json({
    success: true,
    message: "Code chunk stored!",
  });
}
