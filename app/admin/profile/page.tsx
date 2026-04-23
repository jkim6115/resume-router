import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { ProfileForm } from "@/components/profile-form";
import { saveBaseResume } from "@/lib/admin-actions";
import { getBaseResume, parseJsonArray, parseJsonObject } from "@/lib/resume";

export const metadata: Metadata = {
  title: "기본 이력서 수정 | Resume Router",
  description: "기본 이력서의 공통 내용과 일반 지원용 문구를 수정합니다.",
};

export default async function AdminProfilePage() {
  const baseResume = await getBaseResume();
  const initialValues = {
    name: baseResume.name,
    email: baseResume.email,
    phone: baseResume.phone,
    position: baseResume.position,
    selfIntroduction: baseResume.selfIntroduction,
    motivation: baseResume.motivation,
    experience: parseJsonArray(baseResume.experienceJson),
    skills: parseJsonArray(baseResume.skillsJson),
    projects: parseJsonArray(baseResume.projectsJson),
    education: parseJsonArray(baseResume.educationJson),
    training: parseJsonArray(baseResume.trainingJson),
    links: parseJsonObject(baseResume.linksJson) as Record<string, string>,
  };

  return (
    <main className="page">
      <div className="shell stack">
        <AdminNav
          title="공통 이력서 관리"
          description="기본 이력서와 기업별 이력서에 함께 쓰이는 내용을 관리합니다."
        />

        <section className="card panel">
          <ProfileForm action={saveBaseResume} initialValues={initialValues} />
        </section>
      </div>
    </main>
  );
}
