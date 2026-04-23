import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { ResumeForm } from "@/components/resume-form";
import { updateTargetResume } from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";
import { isResumeId } from "@/lib/resume";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const normalizedId = id.toUpperCase();

  if (!isResumeId(normalizedId)) {
    notFound();
  }

  const item = await prisma.targetResume.findUnique({
    where: { id: normalizedId },
    select: { companyName: true },
  });

  if (!item) {
    notFound();
  }

  return {
    title: `${item.companyName} 수정 | Resume Router`,
    description: `${item.companyName} 기업별 이력서 내용을 수정합니다.`,
  };
}

export default async function EditResumePage({ params }: PageProps) {
  const { id } = await params;
  const normalizedId = id.toUpperCase();

  if (!isResumeId(normalizedId)) {
    notFound();
  }

  const item = await prisma.targetResume.findUnique({
    where: { id: normalizedId },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="page">
      <div className="shell stack">
        <AdminNav
          title={`${item.companyName} 수정`}
          description="회사별 자기소개와 지원동기를 업데이트합니다."
        />
        <section className="card panel">
          <ResumeForm
            mode="edit"
            action={updateTargetResume.bind(null, item.id)}
            initialValues={item}
          />
        </section>
      </div>
    </main>
  );
}
