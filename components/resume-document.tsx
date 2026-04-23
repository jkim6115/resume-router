import type { ReactNode } from "react";

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

function compactText(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferRole(position: string, experience: unknown[]) {
  if (position.trim()) {
    return position;
  }

  const firstRole = experience.map((item) => valueFrom(item, "role")).find(Boolean);
  return firstRole || "Developer";
}

function ProfileTable({ email, phone, links }: { email: string; phone: string; links: Record<string, string> }) {
  const primaryLink = Object.entries(links)[0];
  const rows = [
    ["Email", email],
    ["Mobile", phone],
    primaryLink ? [primaryLink[0], primaryLink[1]] : null,
  ].filter(Boolean) as string[][];

  return (
    <table className="resume-info-table">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th>{label}</th>
            <td>
              {value.startsWith("http") ? (
                <a href={value} target="_blank" rel="noreferrer">
                  {value}
                </a>
              ) : (
                value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td className="resume-empty-row" colSpan={colSpan}>
        {text}
      </td>
    </tr>
  );
}

function ExperienceTable({ items }: { items: unknown[] }) {
  return (
    <table className="resume-data-table">
      <thead>
        <tr>
          <th>재직 기간</th>
          <th>회사명</th>
          <th>직무</th>
          <th>담당 업무</th>
          <th>주요 성과</th>
          <th>사용 기술</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <EmptyRow colSpan={6} text="등록된 경력사항이 없습니다." />
        ) : (
          items.map((item, index) => (
            <tr key={`experience-${index}`}>
              <td>{valueFrom(item, "period") || "-"}</td>
              <td>{valueFrom(item, "company") || "-"}</td>
              <td>{valueFrom(item, "role") || "-"}</td>
              <td>{valueFrom(item, "summary") || formatValue(item) || "-"}</td>
              <td>{valueFrom(item, "achievements") || "-"}</td>
              <td>{valueFrom(item, "technologies") || "-"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function ProjectTable({ items }: { items: unknown[] }) {
  return (
    <table className="resume-data-table compact">
      <thead>
        <tr>
          <th>프로젝트</th>
          <th>기간</th>
          <th>역할</th>
          <th>설명</th>
          <th>기술스택</th>
          <th>링크</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <EmptyRow colSpan={6} text="등록된 프로젝트가 없습니다." />
        ) : (
          items.map((item, index) => {
            const link = valueFrom(item, "link");

            return (
              <tr key={`project-${index}`}>
                <td>{valueFrom(item, "name") || "-"}</td>
                <td>{valueFrom(item, "period") || "-"}</td>
                <td>{valueFrom(item, "role") || "-"}</td>
                <td>{valueFrom(item, "summary") || formatValue(item) || "-"}</td>
                <td>{valueFrom(item, "technologies") || "-"}</td>
                <td>
                  {link ? (
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

function SkillTable({ items }: { items: unknown[] }) {
  return (
    <table className="resume-data-table compact">
      <thead>
        <tr>
          <th>구분</th>
          <th>Skill</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <EmptyRow colSpan={2} text="등록된 스킬셋이 없습니다." />
        ) : (
          items.map((item, index) => (
            <tr key={`skill-${index}`}>
              <td>{valueFrom(item, "category") || "-"}</td>
              <td>{valueFrom(item, "items") || formatValue(item) || "-"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function SimpleTable({
  items,
  emptyText,
  columns,
}: {
  items: unknown[];
  emptyText: string;
  columns: Array<[string, string]>;
}) {
  return (
    <table className="resume-data-table compact">
      <thead>
        <tr>
          {columns.map(([label]) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <EmptyRow colSpan={columns.length} text={emptyText} />
        ) : (
          items.map((item, index) => (
            <tr key={`row-${index}`}>
              {columns.map(([label, key]) => (
                <td key={label}>{valueFrom(item, key) || formatValue(item) || "-"}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function LinksTable({ links }: { links: Record<string, string> }) {
  const entries = Object.entries(links);

  return (
    <table className="resume-data-table compact">
      <thead>
        <tr>
          <th>이름</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 ? (
          <EmptyRow colSpan={2} text="등록된 링크가 없습니다." />
        ) : (
          entries.map(([label, url]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
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

      <Section title="프로젝트" englishTitle="Projects">
        <ProjectTable items={projects} />
      </Section>

      <Section title="학력" englishTitle="Education">
        <SimpleTable
          items={education}
          emptyText="등록된 학력 정보가 없습니다."
          columns={[
            ["학교명", "school"],
            ["전공", "major"],
            ["기간", "period"],
          ]}
        />
      </Section>

      <Section title="교육" englishTitle="Training">
        <SimpleTable
          items={training}
          emptyText="등록된 교육 정보가 없습니다."
          columns={[
            ["교육명", "name"],
            ["기간", "period"],
            ["내용", "summary"],
          ]}
        />
      </Section>

      <Section title="외부 링크" englishTitle="Links">
        <LinksTable links={links} />
      </Section>
    </article>
  );
}
