import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume-document";
import { getBaseResume, parseJsonArray, parseJsonObject } from "@/lib/resume";

export async function generateMetadata(): Promise<Metadata> {
  const baseResume = await getBaseResume();

  return {
    title: `기본 이력서 | ${baseResume.name}`,
    description: `${baseResume.name}의 기본 이력서입니다.`,
  };
}

export default async function BaseResumePage() {
  const baseResume = await getBaseResume();
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
          selfIntroduction={baseResume.selfIntroduction}
          motivation={baseResume.motivation}
          motivationTitle="지원동기"
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
