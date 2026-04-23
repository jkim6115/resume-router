import { getBaseResume } from "@/lib/resume";
import { buildBaseResumeMarkdown } from "@/lib/resume-markdown";

export async function GET() {
  const baseResume = await getBaseResume();
  const markdown = buildBaseResumeMarkdown(baseResume);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"resume.md\"",
    },
  });
}
