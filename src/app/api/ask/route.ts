import { NextRequest, NextResponse } from "next/server";
import {
  askCodebase,
  RepoNotFoundError,
  RepoPrivateError,
} from "@/src/lib/ask";

export async function POST(req: NextRequest) {
  try {
    const { question, owner, repo } = await req.json();

    if (!question?.trim() || !owner?.trim() || !repo?.trim()) {
      return NextResponse.json(
        { error: "question, owner, and repo are required" },
        { status: 400 },
      );
    }

    const result = await askCodebase(
      question.trim(),
      owner.trim(),
      repo.trim(),
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof RepoNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof RepoPrivateError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error(error);

    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 },
    );
  }
}
