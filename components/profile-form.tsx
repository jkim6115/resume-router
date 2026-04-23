"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Save } from "lucide-react";

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  achievements: string;
  technologies: string;
};

type EducationItem = {
  school: string;
  major: string;
  period: string;
};

type TrainingItem = {
  name: string;
  period: string;
  summary: string;
};

type SkillItem = {
  category: string;
  items: string;
};

type ProjectItem = {
  name: string;
  period: string;
  role: string;
  summary: string;
  technologies: string;
  link: string;
};

type LinkItem = {
  label: string;
  url: string;
};

type ProfileFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialValues: {
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
  };
};

function toStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toBooleanValue(value: unknown) {
  return value === true || value === "true";
}

function parsePeriodRange(period: string) {
  const normalized = period.trim();
  const [start = "", end = ""] = normalized.split("~").map((value) => value.trim());

  return {
    startDate: /^\d{4}-\d{2}$/.test(start) ? start : "",
    endDate: /^\d{4}-\d{2}$/.test(end) ? end : "",
  };
}

function formatExperiencePeriod(item: Pick<ExperienceItem, "period" | "startDate" | "endDate" | "current">) {
  if (item.startDate && item.current) {
    return `${item.startDate} ~ 재직중`;
  }

  if (item.startDate && item.endDate) {
    return `${item.startDate} ~ ${item.endDate}`;
  }

  if (item.startDate) {
    return item.startDate;
  }

  if (item.current) {
    return "재직중";
  }

  return item.period.trim();
}

function toExperienceItem(value: unknown): ExperienceItem {
  const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const period = toStringValue(item.period);
  const parsedPeriod = parsePeriodRange(period);
  const current = toBooleanValue(item.current) || period.includes("재직중");

  return {
    company: toStringValue(item.company),
    role: toStringValue(item.role),
    period,
    startDate: toStringValue(item.startDate) || parsedPeriod.startDate,
    endDate: current ? "" : toStringValue(item.endDate) || parsedPeriod.endDate,
    current,
    summary: toStringValue(item.summary),
    achievements: toStringValue(item.achievements),
    technologies: toStringValue(item.technologies),
  };
}

function toEducationItem(value: unknown): EducationItem {
  const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

  return {
    school: toStringValue(item.school),
    major: toStringValue(item.major),
    period: toStringValue(item.period),
  };
}

function toTrainingItem(value: unknown): TrainingItem {
  const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

  return {
    name: toStringValue(item.name),
    period: toStringValue(item.period),
    summary: toStringValue(item.summary),
  };
}

function toSkillItem(value: unknown): SkillItem {
  const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

  return {
    category: toStringValue(item.category),
    items: toStringValue(item.items),
  };
}

function toProjectItem(value: unknown): ProjectItem {
  const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

  return {
    name: toStringValue(item.name),
    period: toStringValue(item.period),
    role: toStringValue(item.role),
    summary: toStringValue(item.summary),
    technologies: toStringValue(item.technologies),
    link: toStringValue(item.link),
  };
}

function hasMeaningfulValue(value: string | boolean) {
  return typeof value === "boolean" ? value : value.trim();
}

function compactRecords<T extends Record<string, string | boolean>>(items: T[]) {
  return items.filter((item) => Object.values(item).some(hasMeaningfulValue));
}

function compactExperienceRecords(items: ExperienceItem[]) {
  return compactRecords(
    items.map((item) => ({
      ...item,
      endDate: item.current ? "" : item.endDate,
      period: formatExperiencePeriod(item),
    }))
  );
}

export function ProfileForm({ action, initialValues }: ProfileFormProps) {
  const [experience, setExperience] = useState<ExperienceItem[]>(
    initialValues.experience.length > 0
      ? initialValues.experience.map(toExperienceItem)
      : [
          {
            company: "",
            role: "",
            period: "",
            startDate: "",
            endDate: "",
            current: false,
            summary: "",
            achievements: "",
            technologies: "",
          },
        ]
  );
  const [education, setEducation] = useState<EducationItem[]>(
    initialValues.education.length > 0
      ? initialValues.education.map(toEducationItem)
      : [{ school: "", major: "", period: "" }]
  );
  const [training, setTraining] = useState<TrainingItem[]>(
    initialValues.training.length > 0
      ? initialValues.training.map(toTrainingItem)
      : [{ name: "", period: "", summary: "" }]
  );
  const [skills, setSkills] = useState<SkillItem[]>(
    initialValues.skills.length > 0
      ? initialValues.skills.map(toSkillItem)
      : [{ category: "", items: "" }]
  );
  const [projects, setProjects] = useState<ProjectItem[]>(
    initialValues.projects.length > 0
      ? initialValues.projects.map(toProjectItem)
      : [{ name: "", period: "", role: "", summary: "", technologies: "", link: "" }]
  );
  const [links, setLinks] = useState<LinkItem[]>(
    Object.entries(initialValues.links).length > 0
      ? Object.entries(initialValues.links).map(([label, url]) => ({ label, url }))
      : [{ label: "github", url: "" }]
  );

  const linksJson = JSON.stringify(
    links.reduce<Record<string, string>>((acc, item) => {
      if (item.label.trim() && item.url.trim()) {
        acc[item.label.trim()] = item.url.trim();
      }

      return acc;
    }, {}),
    null,
    2
  );

  return (
    <form className="form" action={action}>
      <div className="grid two">
        <label className="label">
          이름
          <input className="input" name="name" defaultValue={initialValues.name} required />
        </label>
        <label className="label">
          이메일
          <input className="input" name="email" defaultValue={initialValues.email} required />
        </label>
      </div>

      <label className="label">
        연락처
        <input className="input" name="phone" defaultValue={initialValues.phone} required />
      </label>

      <label className="label">
        대표 직무명
        <input
          className="input"
          name="position"
          defaultValue={initialValues.position}
          placeholder="예: Backend Developer"
          required
        />
      </label>

      <label className="label">
        기본 자기소개
        <textarea
          className="textarea compact-textarea"
          name="selfIntroduction"
          defaultValue={initialValues.selfIntroduction}
          required
        />
      </label>

      <label className="label">
        기본 지원 방향
        <textarea
          className="textarea compact-textarea"
          name="motivation"
          defaultValue={initialValues.motivation}
          required
        />
      </label>

      <input type="hidden" name="experienceJson" value={JSON.stringify(compactExperienceRecords(experience), null, 2)} />
      <input type="hidden" name="skillsJson" value={JSON.stringify(compactRecords(skills), null, 2)} />
      <input type="hidden" name="projectsJson" value={JSON.stringify(compactRecords(projects), null, 2)} />
      <input type="hidden" name="educationJson" value={JSON.stringify(compactRecords(education), null, 2)} />
      <input type="hidden" name="trainingJson" value={JSON.stringify(compactRecords(training), null, 2)} />
      <input type="hidden" name="linksJson" value={linksJson} />

      <EditableSection
        title="경력사항"
        description="회사명, 직무, 기간, 주요 내용을 입력하세요."
        addLabel="경력 추가"
        onAdd={() =>
          setExperience((items) => [
            ...items,
            {
              company: "",
              role: "",
              period: "",
              startDate: "",
              endDate: "",
              current: false,
              summary: "",
              achievements: "",
              technologies: "",
            },
          ])
        }
      >
        {experience.map((item, index) => (
          <div className="form-card" key={`experience-${index}`}>
            <div className="toolbar">
              <strong>경력 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setExperience((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <div className="grid two">
              <Field
                label="회사명"
                value={item.company}
                onChange={(value) =>
                  setExperience((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, company: value } : current
                    )
                  )
                }
              />
              <Field
                label="직무"
                value={item.role}
                onChange={(value) =>
                  setExperience((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, role: value } : current
                    )
                  )
                }
              />
            </div>
            <div className="grid two">
              <MonthField
                label="시작 월"
                value={item.startDate}
                onChange={(value) =>
                  setExperience((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, startDate: value } : current
                    )
                  )
                }
              />
              {item.current ? (
                <label className="label">
                  종료 월
                  <span className="static-field">재직중</span>
                </label>
              ) : (
                <MonthField
                  label="종료 월"
                  value={item.endDate}
                  onChange={(value) =>
                    setExperience((items) =>
                      items.map((current, itemIndex) =>
                        itemIndex === index ? { ...current, endDate: value } : current
                      )
                    )
                  }
                />
              )}
            </div>
            <label className="check-label">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(event) =>
                  setExperience((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index
                        ? { ...current, current: event.target.checked, endDate: event.target.checked ? "" : current.endDate }
                        : current
                    )
                  )
                }
              />
              현재 재직중
            </label>
            <TextAreaField
              label="담당 업무"
              value={item.summary}
              onChange={(value) =>
                setExperience((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, summary: value } : current
                  )
                )
              }
            />
            <TextAreaField
              label="주요 성과"
              value={item.achievements}
              onChange={(value) =>
                setExperience((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, achievements: value } : current
                  )
                )
              }
            />
            <Field
              label="사용 기술"
              value={item.technologies}
              placeholder="예: Next.js, Prisma, Docker"
              onChange={(value) =>
                setExperience((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, technologies: value } : current
                  )
                )
              }
            />
          </div>
        ))}
      </EditableSection>

      <EditableSection
        title="스킬셋"
        description="언어, 프레임워크, 도구 등 개발 역량을 분류해 입력하세요."
        addLabel="스킬 추가"
        onAdd={() => setSkills((items) => [...items, { category: "", items: "" }])}
      >
        {skills.map((item, index) => (
          <div className="form-card" key={`skill-${index}`}>
            <div className="toolbar">
              <strong>스킬 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setSkills((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <div className="grid two">
              <Field
                label="분류"
                value={item.category}
                placeholder="예: Programming Languages"
                onChange={(value) =>
                  setSkills((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, category: value } : current
                    )
                  )
                }
              />
              <Field
                label="기술"
                value={item.items}
                placeholder="예: TypeScript, React, Docker"
                onChange={(value) =>
                  setSkills((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, items: value } : current
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </EditableSection>

      <EditableSection
        title="프로젝트"
        description="개인 프로젝트, 포트폴리오, 주요 사이드 프로젝트를 입력하세요."
        addLabel="프로젝트 추가"
        onAdd={() =>
          setProjects((items) => [
            ...items,
            { name: "", period: "", role: "", summary: "", technologies: "", link: "" },
          ])
        }
      >
        {projects.map((item, index) => (
          <div className="form-card" key={`project-${index}`}>
            <div className="toolbar">
              <strong>프로젝트 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setProjects((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <div className="grid two">
              <Field
                label="프로젝트명"
                value={item.name}
                onChange={(value) =>
                  setProjects((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, name: value } : current
                    )
                  )
                }
              />
              <Field
                label="기간"
                value={item.period}
                placeholder="예: 2025-01 ~ 2025-03"
                onChange={(value) =>
                  setProjects((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, period: value } : current
                    )
                  )
                }
              />
            </div>
            <Field
              label="역할"
              value={item.role}
              placeholder="예: Frontend / Full-stack"
              onChange={(value) =>
                setProjects((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, role: value } : current
                  )
                )
              }
            />
            <TextAreaField
              label="설명"
              value={item.summary}
              onChange={(value) =>
                setProjects((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, summary: value } : current
                  )
                )
              }
            />
            <div className="grid two">
              <Field
                label="기술스택"
                value={item.technologies}
                placeholder="예: Next.js, SQLite, Docker"
                onChange={(value) =>
                  setProjects((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, technologies: value } : current
                    )
                  )
                }
              />
              <Field
                label="링크"
                value={item.link}
                placeholder="https://..."
                onChange={(value) =>
                  setProjects((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, link: value } : current
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </EditableSection>

      <EditableSection
        title="학력"
        description="학교명, 전공, 재학 기간을 입력하세요."
        addLabel="학력 추가"
        onAdd={() => setEducation((items) => [...items, { school: "", major: "", period: "" }])}
      >
        {education.map((item, index) => (
          <div className="form-card" key={`education-${index}`}>
            <div className="toolbar">
              <strong>학력 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setEducation((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <div className="grid two">
              <Field
                label="학교명"
                value={item.school}
                onChange={(value) =>
                  setEducation((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, school: value } : current
                    )
                  )
                }
              />
              <Field
                label="전공"
                value={item.major}
                onChange={(value) =>
                  setEducation((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, major: value } : current
                    )
                  )
                }
              />
            </div>
            <Field
              label="기간"
              value={item.period}
              placeholder="예: 2018-03 ~ 2022-02"
              onChange={(value) =>
                setEducation((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, period: value } : current
                  )
                )
              }
            />
          </div>
        ))}
      </EditableSection>

      <EditableSection
        title="교육"
        description="교육명, 기간, 주요 내용을 입력하세요."
        addLabel="교육 추가"
        onAdd={() => setTraining((items) => [...items, { name: "", period: "", summary: "" }])}
      >
        {training.map((item, index) => (
          <div className="form-card" key={`training-${index}`}>
            <div className="toolbar">
              <strong>교육 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setTraining((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <Field
              label="교육명"
              value={item.name}
              onChange={(value) =>
                setTraining((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, name: value } : current
                  )
                )
              }
            />
            <Field
              label="기간"
              value={item.period}
              placeholder="예: 2022-03 ~ 2022-08"
              onChange={(value) =>
                setTraining((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, period: value } : current
                  )
                )
              }
            />
            <TextAreaField
              label="주요 내용"
              value={item.summary}
              onChange={(value) =>
                setTraining((items) =>
                  items.map((current, itemIndex) =>
                    itemIndex === index ? { ...current, summary: value } : current
                  )
                )
              }
            />
          </div>
        ))}
      </EditableSection>

      <EditableSection
        title="링크"
        description="GitHub, 포트폴리오 등 공개 링크를 입력하세요."
        addLabel="링크 추가"
        onAdd={() => setLinks((items) => [...items, { label: "", url: "" }])}
      >
        {links.map((item, index) => (
          <div className="form-card" key={`link-${index}`}>
            <div className="toolbar">
              <strong>링크 {index + 1}</strong>
              <button
                className="button"
                type="button"
                onClick={() => setLinks((items) => items.filter((_, itemIndex) => itemIndex !== index))}
              >
                삭제
              </button>
            </div>
            <div className="grid two">
              <Field
                label="이름"
                value={item.label}
                placeholder="예: github"
                onChange={(value) =>
                  setLinks((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, label: value } : current
                    )
                  )
                }
              />
              <Field
                label="URL"
                value={item.url}
                placeholder="https://..."
                onChange={(value) =>
                  setLinks((items) =>
                    items.map((current, itemIndex) =>
                      itemIndex === index ? { ...current, url: value } : current
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </EditableSection>

      <div className="actions align-end sticky-actions">
        <button
          className="button primary save-floating-button"
          type="submit"
          aria-label="공통 이력서 저장"
          data-tooltip="공통 이력서 저장"
        >
          <Save className="icon" />
        </button>
      </div>
    </form>
  );
}

function EditableSection({
  title,
  description,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="form-section">
      <div className="toolbar">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="muted">{description}</p>
        </div>
        <button className="button" type="button" onClick={onAdd}>
          {addLabel}
        </button>
      </div>
      <div className="stack">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <input
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function MonthField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <input className="input" type="month" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="label">
      {label}
      <textarea
        className="textarea large-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
