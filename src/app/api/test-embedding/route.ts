// app/api/test-embedding/route.ts

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

  return NextResponse.json({
    dimensions: vector.length,
    firstValues: vector.slice(0, 5),
  });
}
