type ResumeRecord = Record<string, unknown>;

type ResumeSectionProps = {
  title: string;
  emptyText: string;
  items: unknown[];
};

const TITLE_KEYS = ["company", "school", "name", "role", "title", "project"];
const META_KEYS = ["role", "major", "period", "date", "location"];
const BODY_KEYS = ["summary", "description", "details"];

const LABELS: Record<string, string> = {
  company: "회사",
  role: "직무",
  period: "기간",
  summary: "요약",
  school: "학교",
  major: "전공",
  name: "이름",
  title: "제목",
  project: "프로젝트",
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
    return value.map(formatValue).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${labelFor(key)}: ${formatValue(nestedValue)}`)
      .join(" / ");
  }

  return String(value ?? "");
}

function labelFor(key: string) {
  return LABELS[key] || key;
}

function pickFirst(record: ResumeRecord, keys: string[]) {
  return keys.find((key) => record[key]);
}

function ResumeEntry({ item }: { item: unknown }) {
  if (!isRecord(item)) {
    return <div className="entry">{formatValue(item)}</div>;
  }

  const titleKey = pickFirst(item, TITLE_KEYS);
  const title = titleKey ? formatValue(item[titleKey]) : "항목";
  const metaEntries = META_KEYS.filter((key) => key !== titleKey && item[key]).map((key) => [
    key,
    formatValue(item[key]),
  ]);
  const bodyKey = pickFirst(item, BODY_KEYS);
  const hiddenKeys = new Set([titleKey, bodyKey, ...META_KEYS].filter(Boolean));
  const detailEntries = Object.entries(item).filter(([key]) => !hiddenKeys.has(key));

  return (
    <article className="entry rich-entry">
      <div>
        <h3>{title}</h3>
        {metaEntries.length > 0 && (
          <div className="entry-meta">
            {metaEntries.map(([key, value]) => (
              <span key={key}>{value}</span>
            ))}
          </div>
        )}
      </div>

      {bodyKey && <p className="entry-body">{formatValue(item[bodyKey])}</p>}

      {detailEntries.length > 0 && (
        <dl className="detail-list">
          {detailEntries.map(([key, value]) => (
            <div className="detail-item" key={key}>
              <dt>{labelFor(key)}</dt>
              <dd>{formatValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

export function ResumeSection({ title, emptyText, items }: ResumeSectionProps) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      {items.length === 0 ? (
        <div className="empty">{emptyText}</div>
      ) : (
        <div className="entry-list">
          {items.map((item, index) => (
            <ResumeEntry item={item} key={`${title}-${index}`} />
          ))}
        </div>
      )}
    </section>
  );
}
