import type { ReactNode } from "react";
import { ExternalLink, Globe, Link2 } from "lucide-react";

type ResumeDocumentProps = {
  name: string;
  email: string;
  phone: string;
  position: string;
  selfIntroduction: string;
  motivation: string;
  experience: unknown[];
  skills: unknown[];
  projects: unknown[];
  education: unknown[];
  training: unknown[];
  links: Record<string, string>;
  motivationTitle?: string;
};

type ResumeRecord = Record<string, unknown>;

const LABELS: Record<string, string> = {
  company: "회사",
  role: "직무",
  period: "기간",
  startDate: "시작 월",
  endDate: "종료 월",
  current: "재직 상태",
  summary: "담당 업무",
  achievements: "주요 성과",
  technologies: "사용 기술",
  link: "링크",
  school: "학교",
  major: "전공",
  name: "이름",
  title: "제목",
  project: "프로젝트",
  category: "분류",
  items: "기술",
  date: "일자",
  location: "위치",
  description: "설명",
  details: "상세",
};

function isRecord(value: unknown): value is ResumeRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "재직중" : "";
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${labelFor(key)}: ${formatValue(nestedValue)}`)
      .filter(Boolean)
      .join(" / ");
  }

  return String(value ?? "").trim();
}

function labelFor(key: string) {
  return LABELS[key] || key;
}

function valueFrom(item: unknown, key: string) {
  return isRecord(item) ? formatValue(item[key]) : "";
}

function isCurrentExperience(item: unknown) {
  return isRecord(item) && (item.current === true || item.current === "true");
}

function periodFromExperience(item: unknown) {
  const period = valueFrom(item, "period");
  const startDate = valueFrom(item, "startDate");
  const endDate = valueFrom(item, "endDate");

  if (!isCurrentExperience(item)) {
    if (startDate && endDate) {
      return `${startDate} ~ ${endDate}`;
    }

    return period || startDate || "-";
  }

  if (startDate) {
    return `${startDate} ~ 재직중`;
  }

  if (!period || period === "재직중") {
    return "재직중";
  }

  if (period.includes("재직중")) {
    return period;
  }

  if (period.includes("~")) {
    return `${period.replace(/\s*~\s*.*$/, "")} ~ 재직중`;
  }

  return `${period} ~ 재직중`;
}

function periodFromRecord(item: unknown) {
  const period = valueFrom(item, "period");
  const startDate = valueFrom(item, "startDate");
  const endDate = valueFrom(item, "endDate");

  if (period) {
    return period;
  }

  if (startDate && endDate) {
    return `${startDate} ~ ${endDate}`;
  }

  return startDate || endDate || "-";
}

function compactText(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitSkillText(value: string) {
  return value
    .split(/[\n,，、]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function inferRole(position: string, experience: unknown[]) {
  if (position.trim()) {
    return position;
  }

  const firstRole = experience.map((item) => valueFrom(item, "role")).find(Boolean);
  return firstRole || "Developer";
}

function iconForLink(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("github") || normalized === "git") {
    return (
      <img
        className="brand-icon"
        src="https://github.githubassets.com/favicons/favicon.svg"
        alt=""
        aria-hidden="true"
      />
    );
  }

  if (normalized.includes("linkedin")) {
    return <Link2 className="icon" aria-hidden="true" />;
  }

  if (
    normalized.includes("blog") ||
    normalized.includes("portfolio") ||
    normalized.includes("website") ||
    normalized.includes("site")
  ) {
    return <Globe className="icon" aria-hidden="true" />;
  }

  return <ExternalLink className="icon" aria-hidden="true" />;
}

function labelForLink(label: string) {
  const normalized = label.trim();

  if (!normalized) {
    return "링크";
  }

  return normalized;
}

function ProfileTable({ email, phone, links }: { email: string; phone: string; links: Record<string, string> }) {
  const rows = [
    ["Email", email],
    ["Mobile", phone],
  ].filter(Boolean) as string[][];
  const linkEntries = Object.entries(links).filter(([, url]) => url.trim());

  return (
    <div className="resume-contact">
      <table className="resume-info-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {linkEntries.length > 0 ? (
        <div className="resume-link-icons" aria-label="외부 링크">
          {linkEntries.map(([label, url]) => (
            <a
              key={`${label}-${url}`}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={labelForLink(label)}
              title={labelForLink(label)}
            >
              {iconForLink(label)}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  englishTitle,
  children,
}: {
  title: string;
  englishTitle: string;
  children: ReactNode;
}) {
  return (
    <section className="resume-block">
      <h2>
        <span>{title}</span>
        <span>/ {englishTitle}</span>
      </h2>
      {children}
    </section>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return <div className="resume-empty-block">{text}</div>;
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <strong>{label}</strong>
      {value || "-"}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="resume-detail-field">
      <strong>{label}</strong>
      <p>{value || "-"}</p>
    </div>
  );
}

function ExperienceTable({ items }: { items: unknown[] }) {
  return (
    <div className="resume-detail-list">
      {items.length === 0 ? (
        <EmptyBlock text="등록된 경력사항이 없습니다." />
      ) : (
        items.map((item, index) => (
          <article className="resume-detail-card" key={`experience-${index}`}>
            <div className="resume-detail-head">
              <h3>{valueFrom(item, "company") || "회사명 미입력"}</h3>
              <div className="resume-detail-meta">
                <DetailMeta label="기간" value={periodFromExperience(item)} />
                <DetailMeta label="직무" value={valueFrom(item, "role")} />
              </div>
            </div>
            <DetailField label="담당 업무" value={valueFrom(item, "summary") || formatValue(item)} />
            <DetailField label="주요 성과" value={valueFrom(item, "achievements")} />
            <DetailField label="사용 기술" value={valueFrom(item, "technologies")} />
          </article>
        ))
      )}
    </div>
  );
}

function ProjectTable({ items }: { items: unknown[] }) {
  return (
    <div className="resume-detail-list">
      {items.length === 0 ? (
        <EmptyBlock text="등록된 프로젝트가 없습니다." />
      ) : (
        items.map((item, index) => {
          const link = valueFrom(item, "link");

          return (
            <article className="resume-detail-card" key={`project-${index}`}>
              <div className="resume-detail-head">
                <h3>{valueFrom(item, "name") || "프로젝트명 미입력"}</h3>
                <div className="resume-detail-meta">
                  <DetailMeta label="기간" value={valueFrom(item, "period")} />
                  <DetailMeta label="역할" value={valueFrom(item, "role")} />
                </div>
              </div>
              <DetailField label="설명" value={valueFrom(item, "summary") || formatValue(item)} />
              <DetailField label="기술스택" value={valueFrom(item, "technologies")} />
              <div className="resume-detail-field">
                <strong>링크</strong>
                <p>
                  {link ? (
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

function SkillTable({ items }: { items: unknown[] }) {
  const skills = items
    .flatMap((item) => {
      const value = valueFrom(item, "items") || valueFrom(item, "category") || formatValue(item);
      return splitSkillText(value);
    })
    .filter(Boolean);

  return (
    <div className="skill-list">
      {skills.length === 0 ? (
        <EmptyBlock text="등록된 기술스택이 없습니다." />
      ) : (
        skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)
      )}
    </div>
  );
}

function TrainingList({ items }: { items: unknown[] }) {
  return (
    <div className="resume-detail-list">
      {items.length === 0 ? (
        <EmptyBlock text="등록된 교육 정보가 없습니다." />
      ) : (
        items.map((item, index) => (
          <article className="resume-detail-card" key={`training-${index}`}>
            <div className="resume-detail-head">
              <h3>{valueFrom(item, "name") || "교육명 미입력"}</h3>
              <div className="resume-detail-meta">
                <DetailMeta label="기간" value={valueFrom(item, "period")} />
              </div>
            </div>
            <DetailField label="내용" value={valueFrom(item, "summary") || formatValue(item)} />
          </article>
        ))
      )}
    </div>
  );
}

function EducationList({ items }: { items: unknown[] }) {
  return (
    <div className="resume-detail-list">
      {items.length === 0 ? (
        <EmptyBlock text="등록된 학력 정보가 없습니다." />
      ) : (
        items.map((item, index) => (
          <article className="resume-detail-card education-card" key={`education-${index}`}>
            <div className="resume-detail-head">
              <h3>{valueFrom(item, "school") || valueFrom(item, "name") || "학교명 미입력"}</h3>
              <div className="resume-detail-meta">
                <DetailMeta label="기간" value={periodFromRecord(item)} />
                <DetailMeta label="전공" value={valueFrom(item, "major")} />
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

export function ResumeDocument({
  name,
  email,
  phone,
  position,
  selfIntroduction,
  motivation,
  experience,
  skills,
  projects,
  education,
  training,
  links,
  motivationTitle = "지원동기",
}: ResumeDocumentProps) {
  const selfIntroductionLines = compactText(selfIntroduction);
  const motivationLines = compactText(motivation);

  return (
    <article className="resume-doc resume-paper">
      <header className="resume-sheet-header">
        <div className="resume-identity">
          <h1>{name}</h1>
          <p>{inferRole(position, experience)}</p>
        </div>
        <ProfileTable email={email} phone={phone} links={links} />
      </header>

      <Section title="소개" englishTitle="About Me">
        <ul className="resume-bullets">
          {selfIntroductionLines.length === 0 ? (
            <li>등록된 소개 문구가 없습니다.</li>
          ) : (
            selfIntroductionLines.map((line, index) => (
              <li key={`about-${index}`}>{line}</li>
            ))
          )}
        </ul>
      </Section>

      <Section title={motivationTitle} englishTitle="Motivation">
        <ul className="resume-bullets">
          {motivationLines.length === 0 ? (
            <li>등록된 내용이 없습니다.</li>
          ) : (
            motivationLines.map((line, index) => (
              <li key={`motivation-${index}`}>{line}</li>
            ))
          )}
        </ul>
      </Section>

      <Section title="경력 사항" englishTitle="Work Experience">
        <ExperienceTable items={experience} />
      </Section>

      <Section title="기술스택" englishTitle="Skill Set">
        <SkillTable items={skills} />
      </Section>

      {projects.length > 0 ? (
        <Section title="프로젝트" englishTitle="Projects">
          <ProjectTable items={projects} />
        </Section>
      ) : null}

      <Section title="학력" englishTitle="Education">
        <EducationList items={education} />
      </Section>

      <Section title="교육" englishTitle="Training">
        <TrainingList items={training} />
      </Section>

    </article>
  );
}
