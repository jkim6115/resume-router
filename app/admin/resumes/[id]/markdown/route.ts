import { buildTargetResumeMarkdown } from "@/lib/resume-markdown";
import { getBaseResume, getTargetResumeOrThrow } from "@/lib/resume";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params;
  const [baseResume, targetResume] = await Promise.all([
    getBaseResume(),
    getTargetResumeOrThrow(id),
  ]);
  const markdown = buildTargetResumeMarkdown(baseResume, targetResume);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="resume-${targetResume.id}.md"`,
    },
  });
}
