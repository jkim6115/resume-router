# AGENTS.md

## Project Purpose

Resume Router serves stable public resume URLs for job applications.

The app supports two public resume types:

- `GET /resume`: general-purpose base resume
- `GET /resumes/:id`: company-specific resume

Company-specific resumes are looked up only by a 6-character identifier. Invalid IDs or missing records must return `404`.

Each company-specific resume is assembled from:

- shared base resume data
- shared skill set, experience, education, training, and links
- company-specific self introduction
- company-specific motivation

## Current Requirements

- Framework: `Next.js` only
- Do not introduce `Nest.js`
- Use `Next.js App Router` for routing and server-side logic
- Use server components for read flows where practical
- Use server actions for admin mutations
- Deployment target: on-premise Docker
- Database: `SQLite`
- ORM: `Prisma`
- Admin page is required
- Admin pages are protected by Basic Auth
- Admin list must make public URLs easy to copy
- Public resume pages must not show the target company name
- Markdown export is required for AI feedback workflows and must stay admin-only

## Routes

Public:

- `/`
- `/resume`
- `/resumes/[id]`

Admin:

- `/admin/resumes`
- `/admin/resumes/new`
- `/admin/resumes/[id]/edit`
- `/admin/profile`
- `/admin/resume/markdown`
- `/admin/resumes/[id]/markdown`

## Resume Structure

Base resume:

- name
- email
- phone
- self introduction for the general resume
- general motivation / direction
- experience
- skill set / technology stack
- projects
- education
- training
- external links such as GitHub or portfolio

Target resume:

- 6-character ID
- company name for admin identification only
- company-specific self introduction
- company-specific motivation
- optional notes

## Data Model

Keep common resume content separate from company-specific content.

### BaseResume

- `name`
- `email`
- `phone`
- `selfIntroduction`
- `motivation`
- `experienceJson`
- `skillsJson`
- `projectsJson`
- `educationJson`
- `trainingJson`
- `linksJson`
- timestamps

### TargetResume

- `id`
- `companyName`
- `selfIntroduction`
- `motivation`
- `notes`
- timestamps

## UI Notes

- Public resume pages use a document-style layout inspired by a developer resume template.
- Admin pages use a restrained table-oriented UI.
- Admin target list supports company-name search.
- Copying a resume URL happens by clicking the URL box.
- Admin action icons use `lucide-react`.
- Floating save buttons should remain square and icon-only.

## Test And UI Stability Rules

Future AI-assisted changes must preserve the established admin and public resume layouts.

For user-requested feature additions or modifications, follow `WORKFLOW.md`:

1. Receive the user's prompt.
2. Propose a plan, including test scope.
3. Wait for user approval.
4. Implement after approval.
5. Run relevant tests and report results.

For UI-related changes, run:

- `npm run build`
- `npm run test:e2e`
- `npm run test:visual`

When a visual design change is intentional, update the Playwright screenshots with:

- `npm run test:visual:update`

The Playwright setup uses `file:./test.db` and seeds stable sample data for `/resume`, `/resumes/AB12CD`, and the admin pages.

Visual coverage must include:

- `/`
- `/resume`
- `/resumes/AB12CD`
- `/admin/resumes`
- `/admin/profile`
- `/admin/resumes/new`
- `/admin/resumes/AB12CD/edit`

Do not change global button, form, table, floating save button, or resume document styles unless the user explicitly requests a design change.

## Delivery Principles

- Prefer simple, maintainable Next.js code over premature abstraction.
- Keep public rendering read-only and fast.
- Keep admin workflows efficient for a single primary user.
- Optimize the admin list page for quickly finding, copying, previewing, exporting, editing, and deleting resumes.
- Keep Docker setup small and easy to run on-premise.
- Avoid showing company names on public resume pages unless explicitly requested.

## Future Notes

- If PDF export is added, keep the current data model reusable.
- If authentication grows beyond a single trusted user, replace Basic Auth with a proper admin login flow.
- If resume sections become more complex, consider replacing JSON fields with normalized relational tables.
