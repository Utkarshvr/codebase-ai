import { indexRepository } from "./indexer";
import { getRepoInfo } from "./github";
import { generateAnswer } from "./llm";
import { repoExistsInQdrant, searchCode } from "./search";

export class RepoNotFoundError extends Error {
  status = 404;

  constructor(owner: string, repo: string) {
    super(`Repository "${owner}/${repo}" was not found on GitHub.`);
    this.name = "RepoNotFoundError";
  }
}

export class RepoPrivateError extends Error {
  status = 403;

  constructor(owner: string, repo: string) {
    super(
      `Repository "${owner}/${repo}" is private. Only public repositories can be indexed.`,
    );
    this.name = "RepoPrivateError";
  }
}

export type AskResult = {
  answer: string;
  repo: string;
  fromCache: boolean;
  indexStats?: { files: number; chunks: number };
};

export async function askCodebase(
  question: string,
  owner: string,
  repoName: string,
): Promise<AskResult> {
  const repo = `${owner}/${repoName}`;
  console.log("repo", repo);
  const fromCache = await repoExistsInQdrant(repo);
  console.log("fromCache", fromCache);
  let indexStats: { files: number; chunks: number } | undefined;

  if (!fromCache) {
    const repoInfo = await getRepoInfo(owner, repoName);

    if (!repoInfo.exists) {
      throw new RepoNotFoundError(owner, repoName);
    }

    if (!repoInfo.public) {
      throw new RepoPrivateError(owner, repoName);
    }

    indexStats = await indexRepository(owner, repoName);
  }

  const results = await searchCode(question, repo, 5, 0.2);

  if (results.length === 0) {
    return {
      answer: "I couldn't find relevant code for this question.",
      repo,
      fromCache,
      indexStats,
    };
  }

  const context = results
    .map((result) => {
      const payload = result.payload as {
        file: string;
        startLine: number;
        endLine: number;
        code: string;
      };

      return `
File: ${payload.file}
Lines: ${payload.startLine}-${payload.endLine}

${payload.code}
`;
    })
    .join("\n---\n");

  const answer = await generateAnswer(question, context);

  return {
    answer,
    repo,
    fromCache,
    indexStats,
  };
}
