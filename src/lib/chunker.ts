export function chunkCode(code: string, chunkSize = 50) {
  const lines = code.split("\n");

  const chunks: { code: string; startLine: number; endLine: number }[] = [];

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunkLines = lines.slice(i, i + chunkSize);

    chunks.push({
      code: chunkLines.join("\n"),
      startLine: i + 1,
      endLine: Math.min(i + chunkSize, lines.length),
    });
  }

  return chunks;
}
