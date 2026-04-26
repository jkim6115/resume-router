"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { ExperienceItem, EducationItem, TrainingItem, SkillItem, ProjectItem, LinkItem } from "@/lib/resume-types";
import { ExperienceSection } from "./profile-form/experience-section";
import { ProjectsSection } from "./profile-form/projects-section";
import { EducationSection } from "./profile-form/education-section";
import { TrainingSection } from "./profile-form/training-section";
import { LinksSection } from "./profile-form/links-section";
import { SkillsSection } from "./profile-form/skills-section";

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

function toStr(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toBool(value: unknown) {
  return value === true || value === "true";
}

function parsePeriodRange(period: string) {
  const [start = "", end = ""] = period.trim().split("~").map((v) => v.trim());
  return {
    startDate: /^\d{4}-\d{2}$/.test(start) ? start : "",
    endDate: /^\d{4}-\d{2}$/.test(end) ? end : "",
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function toExperienceItem(value: unknown): ExperienceItem {
  const item = toRecord(value);
  const period = toStr(item.period);
  const parsed = parsePeriodRange(period);
  const current = toBool(item.current) || period.includes("재직중");
  return {
    company: toStr(item.company),
    role: toStr(item.role),
    period,
    startDate: toStr(item.startDate) || parsed.startDate,
    endDate: current ? "" : toStr(item.endDate) || parsed.endDate,
    current,
    summary: toStr(item.summary),
    achievements: toStr(item.achievements),
    technologies: toStr(item.technologies),
  };
}

function toEducationItem(value: unknown): EducationItem {
  const item = toRecord(value);
  const period = toStr(item.period);
  const parsed = parsePeriodRange(period);
  return {
    school: toStr(item.school),
    major: toStr(item.major),
    period,
    startDate: toStr(item.startDate) || parsed.startDate,
    endDate: toStr(item.endDate) || parsed.endDate,
  };
}

function toTrainingItem(value: unknown): TrainingItem {
  const item = toRecord(value);
  const period = toStr(item.period);
  const parsed = parsePeriodRange(period);
  return {
    name: toStr(item.name),
    period,
    startDate: toStr(item.startDate) || parsed.startDate,
    endDate: toStr(item.endDate) || parsed.endDate,
    summary: toStr(item.summary),
  };
}

function toSkillItem(value: unknown): SkillItem {
  const item = toRecord(value);
  return { category: toStr(item.category), items: toStr(item.items) };
}

function toProjectItem(value: unknown): ProjectItem {
  const item = toRecord(value);
  const period = toStr(item.period);
  const parsed = parsePeriodRange(period);
  return {
    name: toStr(item.name),
    period,
    startDate: toStr(item.startDate) || parsed.startDate,
    endDate: toStr(item.endDate) || parsed.endDate,
    role: toStr(item.role),
    summary: toStr(item.summary),
    technologies: toStr(item.technologies),
    link: toStr(item.link),
  };
}

function skillsToText(items: unknown[]) {
  return items
    .map(toSkillItem)
    .map((item) => item.items || item.category)
    .filter(Boolean)
    .join("\n");
}

function hasMeaningfulValue(value: string | boolean) {
  return typeof value === "boolean" ? value : value.trim();
}

function compactRecords<T extends Record<string, string | boolean>>(items: T[]) {
  return items.filter((item) => Object.values(item).some(hasMeaningfulValue));
}

function formatExperiencePeriod(item: Pick<ExperienceItem, "period" | "startDate" | "endDate" | "current">) {
  if (item.startDate && item.current) return `${item.startDate} ~ 재직중`;
  if (item.startDate && item.endDate) return `${item.startDate} ~ ${item.endDate}`;
  if (item.startDate) return item.startDate;
  if (item.current) return "재직중";
  return item.period.trim();
}

function formatPeriod(item: { period: string; startDate: string; endDate: string }) {
  if (item.startDate && item.endDate) return `${item.startDate} ~ ${item.endDate}`;
  return item.startDate || item.endDate || item.period.trim();
}

function compactExperienceRecords(items: ExperienceItem[]) {
  return compactRecords(
    items.map((item) => ({ ...item, endDate: item.current ? "" : item.endDate, period: formatExperiencePeriod(item) }))
  );
}

function compactEducationRecords(items: EducationItem[]) {
  return compactRecords(items.map((item) => ({ ...item, period: formatPeriod(item) })));
}

function compactTrainingRecords(items: TrainingItem[]) {
  return compactRecords(items.map((item) => ({ ...item, period: formatPeriod(item) })));
}

function compactProjectRecords(items: ProjectItem[]) {
  return compactRecords(items.map((item) => ({ ...item, period: formatPeriod(item) })));
}

function buildSkillRecords(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((items) => ({ items }));
}

export function ProfileForm({ action, initialValues }: ProfileFormProps) {
  const [experience, setExperience] = useState<ExperienceItem[]>(
    initialValues.experience.length > 0
      ? initialValues.experience.map(toExperienceItem)
      : [{ company: "", role: "", period: "", startDate: "", endDate: "", current: false, summary: "", achievements: "", technologies: "" }]
  );
  const [education, setEducation] = useState<EducationItem[]>(
    initialValues.education.length > 0
      ? initialValues.education.map(toEducationItem)
      : [{ school: "", major: "", period: "", startDate: "", endDate: "" }]
  );
  const [training, setTraining] = useState<TrainingItem[]>(
    initialValues.training.length > 0
      ? initialValues.training.map(toTrainingItem)
      : [{ name: "", period: "", startDate: "", endDate: "", summary: "" }]
  );
  const [skillsText, setSkillsText] = useState(skillsToText(initialValues.skills));
  const [projects, setProjects] = useState<ProjectItem[]>(
    initialValues.projects.length > 0
      ? initialValues.projects.map(toProjectItem)
      : [{ name: "", period: "", startDate: "", endDate: "", role: "", summary: "", technologies: "", link: "" }]
  );
  const [links, setLinks] = useState<LinkItem[]>(
    Object.entries(initialValues.links).length > 0
      ? Object.entries(initialValues.links).map(([label, url]) => ({ label, url }))
      : [{ label: "github", url: "" }]
  );

  const linksJson = JSON.stringify(
    links.reduce<Record<string, string>>((acc, { label, url }) => {
      if (label.trim() && url.trim()) acc[label.trim()] = url.trim();
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
        <textarea className="textarea compact-textarea" name="selfIntroduction" defaultValue={initialValues.selfIntroduction} required />
      </label>

      <label className="label">
        기본 지원동기
        <textarea className="textarea compact-textarea" name="motivation" defaultValue={initialValues.motivation} required />
      </label>

      <input type="hidden" name="experienceJson" value={JSON.stringify(compactExperienceRecords(experience), null, 2)} />
      <input type="hidden" name="skillsJson" value={JSON.stringify(buildSkillRecords(skillsText), null, 2)} />
      <input type="hidden" name="projectsJson" value={JSON.stringify(compactProjectRecords(projects), null, 2)} />
      <input type="hidden" name="educationJson" value={JSON.stringify(compactEducationRecords(education), null, 2)} />
      <input type="hidden" name="trainingJson" value={JSON.stringify(compactTrainingRecords(training), null, 2)} />
      <input type="hidden" name="linksJson" value={linksJson} />

      <ExperienceSection items={experience} onChange={setExperience} />
      <SkillsSection value={skillsText} onChange={setSkillsText} />
      <ProjectsSection items={projects} onChange={setProjects} />
      <EducationSection items={education} onChange={setEducation} />
      <TrainingSection items={training} onChange={setTraining} />
      <LinksSection items={links} onChange={setLinks} />

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
