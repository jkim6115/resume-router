export type ExperienceItem = {
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

export type EducationItem = {
  school: string;
  major: string;
  period: string;
  startDate: string;
  endDate: string;
  currentlyEnrolled: boolean;
};

export type TrainingItem = {
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  summary: string;
};

export type SkillItem = {
  category: string;
  items: string;
};

export type ProjectItem = {
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  role: string;
  summary: string;
  technologies: string;
  link: string;
};

export type LinkItem = {
  label: string;
  url: string;
};
