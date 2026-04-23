import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FileText, Globe, Pencil, Plus } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { CopyableUrl } from "@/components/copyable-url";
import { DeleteResumeButton } from "@/components/delete-resume-button";
import { deleteTargetResume } from "@/lib/admin-actions";
import {
  buildBaseResumeMarkdownUrl,
  buildBaseResumeUrl,
  buildResumeMarkdownUrl,
  buildResumeUrl,
} from "@/lib/resume";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "이력서 관리 | Resume Router",
  description: "기본 이력서와 기업별 이력서 URL을 관리합니다.",
};

type AdminResumesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

function IconLink({
  href,
  label,
  children,
  primary = false,
  target,
}: {
  href: string;
  label: string;
  children: ReactNode;
  primary?: boolean;
  target?: "_blank";
}) {
  return (
    <Link
      className={`button icon-button${primary ? " primary" : ""}`}
      href={href}
      target={target}
      aria-label={label}
      data-tooltip={label}
    >
      {children}
    </Link>
  );
}

export default async function AdminResumesPage({ searchParams }: AdminResumesPageProps) {
  const { q } = await searchParams;
  const query = String(q || "").trim();
  const items = await prisma.targetResume.findMany({
    where: query
      ? {
          companyName: {
            contains: query,
          },
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });
  const baseResumeUrl = buildBaseResumeUrl();
  const baseResumeMarkdownUrl = buildBaseResumeMarkdownUrl();

  return (
    <main className="page">
      <div className="shell stack">
        <AdminNav
          title="기업별 이력서 관리"
          description="회사용 자기소개와 지원동기를 관리하고, 공개 URL을 즉시 복사할 수 있습니다."
        />

        <section className="card panel stack">
          <div className="toolbar">
            <div>
              <h2 className="section-title">기본 이력서</h2>
            </div>
          </div>
          <div className="base-resume-row">
            <div>
              <strong>공개 기본 URL</strong>
            </div>
            <CopyableUrl value={baseResumeUrl} compact />
            <div className="actions table-actions">
              <IconLink href="/resume" target="_blank" label="공개 페이지 보기">
                <Globe className="icon" />
              </IconLink>
              <IconLink href={baseResumeMarkdownUrl} label="마크다운 내보내기">
                <FileText className="icon" />
              </IconLink>
              <IconLink href="/admin/profile" label="수정">
                <Pencil className="icon" />
              </IconLink>
            </div>
          </div>
        </section>

        <section className="card panel stack">
          <div className="toolbar">
            <div>
              <h2 className="section-title">기업별 이력서 목록</h2>
            </div>
            <div className="actions align-end">
              <div className="badge">{items.length} entries</div>
              <IconLink href="/admin/resumes/new" label="새 항목 추가" primary>
                <Plus className="icon" />
              </IconLink>
            </div>
          </div>

          <form className="search-form" action="/admin/resumes">
            <label className="label">
              <span className="sr-only">회사명 검색</span>
              <input
                className="input"
                name="q"
                placeholder="회사명으로 검색"
                defaultValue={query}
              />
            </label>
            <div className="actions">
              <button className="button" type="submit">
                검색
              </button>
              {query ? (
                <Link className="button" href="/admin/resumes">
                  초기화
                </Link>
              ) : null}
            </div>
          </form>

          {items.length === 0 ? (
            <div className="empty">
              {query ? "검색 결과가 없습니다." : "아직 생성된 기업별 이력서가 없습니다."}
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>회사명</th>
                    <th>ID</th>
                    <th>URL</th>
                    <th>업데이트</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const publicUrl = buildResumeUrl(item.id);

                    return (
                      <tr key={item.id}>
                        <td data-label="회사명">
                          <strong>{item.companyName}</strong>
                        </td>
                        <td data-label="ID">
                          <code>{item.id}</code>
                        </td>
                        <td data-label="URL">
                          <CopyableUrl value={publicUrl} compact />
                        </td>
                        <td data-label="업데이트">{item.updatedAt.toISOString().slice(0, 10)}</td>
                        <td data-label="액션">
                          <div className="actions table-actions">
                            <IconLink href={`/resumes/${item.id}`} target="_blank" label="공개 페이지 보기">
                              <Globe className="icon" />
                            </IconLink>
                            <IconLink href={buildResumeMarkdownUrl(item.id)} label="마크다운 내보내기">
                              <FileText className="icon" />
                            </IconLink>
                            <IconLink href={`/admin/resumes/${item.id}/edit`} label="수정">
                              <Pencil className="icon" />
                            </IconLink>
                            <form action={deleteTargetResume.bind(null, item.id)}>
                              <DeleteResumeButton companyName={item.companyName} />
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
