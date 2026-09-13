import { NextRequest, NextResponse } from "next/server";
import { askCodebase } from "@/src/lib/ask";

export async function POST(req: NextRequest) {
  try {
    const { question, repo } = await req.json();

    if (!question || !repo) {
      return NextResponse.json(
        { error: "question and repo are required" },
        { status: 400 },
      );
    }

    const answer = await askCodebase(question, repo);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 },
    );
  }
}
