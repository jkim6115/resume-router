import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume Router",
  description: "기본 이력서와 기업별 이력서를 공개 URL과 마크다운으로 관리합니다.",
};

export default function HomePage() {
  return (
    <main className="page">
      <div className="shell stack">
        <section className="hero">
          <div className="eyebrow">Resume Router</div>
          <h1 className="title">기업별 이력서를 링크 하나로 관리합니다.</h1>
          <p className="muted">
            기본 이력서와 기업별 자기소개, 지원동기를 조합해 공개 URL과 마크다운으로 제공합니다.
          </p>
          <div className="actions">
            <Link className="button primary" href="/admin/resumes">
              관리자 페이지
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
