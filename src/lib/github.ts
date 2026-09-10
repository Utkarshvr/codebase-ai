export async function getRepoTree(
  owner: string,
  repo: string,
  branch = "main",
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repo tree: ${response.status}`);
  }

  const data = await response.json();

  return data.tree;
}

export async function getBlob(owner: string, repo: string, sha: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch blob: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getFileContent(owner: string, repo: string, sha: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch blob: ${response.status}`);
  }

  const data = await response.json();

  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function getRepositoryFiles(
  owner: string,
  repo: string,
  branch = "main",
) {
  const tree = await getRepoTree(owner, repo, branch);

  const files = tree.filter(
    (item) => item.type === "blob" && isCodeFile(item.path),
  );

  const results = await Promise.all(
    files.map(async (file) => {
      const code = await getFileContent(owner, repo, file.sha);

      return {
        path: file.path,
        code,
      };
    }),
  );

  return results;
}

const IGNORED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
];

const CODE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".swift",
];

export function isCodeFile(path: string) {
  if (IGNORED_DIRS.some((dir) => path.includes(`/${dir}/`))) {
    return false;
  }

  return CODE_EXTENSIONS.some((ext) => path.endsWith(ext));
}
