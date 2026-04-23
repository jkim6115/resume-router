import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { ResumeForm } from "@/components/resume-form";
import { createTargetResume } from "@/lib/admin-actions";

export const metadata: Metadata = {
  title: "기업별 이력서 생성 | Resume Router",
  description: "기업별 자기소개와 지원동기가 포함된 이력서를 생성합니다.",
};

export default function NewResumePage() {
  return (
    <main className="page">
      <div className="shell stack">
        <AdminNav
          title="기업별 이력서 생성"
          description="회사명, 기업별 자기소개, 지원동기를 입력하면 중복되지 않는 6자리 ID가 자동 생성됩니다."
        />
        <section className="card panel">
          <ResumeForm mode="create" action={createTargetResume} />
        </section>
      </div>
    </main>
  );
}
