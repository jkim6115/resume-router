import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume-document";
import { getBaseResume, getTargetResumeOrThrow, parseJsonArray, parseJsonObject } from "@/lib/resume";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [baseResume, targetResume] = await Promise.all([
    getBaseResume(),
    getTargetResumeOrThrow(id),
  ]);

  return {
    title: `${targetResume.companyName} 이력서 | ${baseResume.name}`,
    description: `${targetResume.companyName} 지원용 ${baseResume.name}의 이력서입니다.`,
  };
}

export default async function ResumePage({ params }: PageProps) {
  const { id } = await params;
  const [baseResume, targetResume] = await Promise.all([
    getBaseResume(),
    getTargetResumeOrThrow(id),
  ]);

  const experience = parseJsonArray(baseResume.experienceJson);
  const skills = parseJsonArray(baseResume.skillsJson);
  const projects = parseJsonArray(baseResume.projectsJson);
  const education = parseJsonArray(baseResume.educationJson);
  const training = parseJsonArray(baseResume.trainingJson);
  const links = parseJsonObject(baseResume.linksJson) as Record<string, string>;

  return (
    <main className="page">
      <div className="shell">
        <ResumeDocument
          name={baseResume.name}
          email={baseResume.email}
          phone={baseResume.phone}
          position={baseResume.position}
          selfIntroduction={targetResume.selfIntroduction}
          motivation={targetResume.motivation}
          experience={experience}
          skills={skills}
          projects={projects}
          education={education}
          training={training}
          links={links}
        />
      </div>
    </main>
  );
}
