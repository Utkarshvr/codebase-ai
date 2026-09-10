import { getFileContent, getRepoTree, isCodeFile } from "@/src/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  //   const tree = await getRepoTree("facebook", "react");

  //   const files = tree.filter(
  //     (item) => item.type === "blob" && isCodeFile(item.path),
  //   );

  const code = await getFileContent("facebook", "react", "a486ccf2d91ecafd7437e3bcd0c59bfe8c1e9e24");

  console.log(code);

  return NextResponse.json({ code });
}
