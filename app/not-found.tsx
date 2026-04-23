import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="shell">
        <section className="card panel stack">
          <div className="eyebrow">404</div>
          <h1 className="title">이력서를 찾을 수 없습니다.</h1>
          <p className="muted">
            유효한 6자리 ID인지 확인하거나 관리자 페이지에서 항목을 생성해 주세요.
          </p>
          <div className="actions">
            <Link className="button primary" href="/admin/resumes">
              관리자 페이지로 이동
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
