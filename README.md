# Resume Router

![이력서 관리 화면](./images/이력서%20관리%20화면.png)
![기업별 이력서 샘플](./images/기업별%20이력서%20샘플.png)

Resume Router는 지원 회사별로 맞춤 이력서를 만들고, 안정적인 공개 URL로 제공하는 Next.js 애플리케이션입니다.

하나의 공통 이력서를 유지하면서 회사별 자기소개와 지원동기만 따로 관리할 수 있습니다. 각 이력서는 짧은 URL로 공유할 수 있고, 관리자 화면에서는 Markdown으로 내보내 AI 도구에 붙여 넣어 피드백을 받기 쉽게 설계했습니다.

## 주요 기능

- 기본 이력서 공개 페이지: `/resume`
- 기업별 이력서 공개 페이지: `/resumes/:id`
- 기업별 이력서에 6자리 공개 ID 자동 부여
- 관리자 화면에서 이력서 생성, 수정, 삭제, 검색, URL 복사
- 관리자용 Markdown 내보내기
- 공개 이력서 본문에는 지원 회사명 비노출
- Prisma와 SQLite 기반 데이터 저장
- 관리자 페이지 Basic Auth 보호
- 온프레미스 실행을 위한 Docker 구성

## 기술 스택

- Next.js App Router
- React
- Prisma
- SQLite
- lucide-react
- Docker

이 프로젝트는 의도적으로 Next.js만 사용합니다. 별도 백엔드 프레임워크를 두지 않고 App Router, Server Components, Server Actions, Prisma, Middleware로 서버 기능을 처리합니다.

## 주요 경로

| 경로 | 설명 |
| --- | --- |
| `/` | 관리자 페이지로 진입할 수 있는 시작 페이지 |
| `/resume` | 기본 이력서 공개 페이지 |
| `/resumes/[id]` | 기업별 이력서 공개 페이지 |
| `/admin/resumes` | 이력서 목록, 검색, URL 복사, 미리보기, 내보내기, 수정, 삭제 |
| `/admin/resume/markdown` | 기본 이력서 Markdown 내보내기 |
| `/admin/resumes/[id]/markdown` | 기업별 이력서 Markdown 내보내기 |
| `/admin/resumes/new` | 기업별 이력서 생성 |
| `/admin/resumes/[id]/edit` | 기업별 이력서 수정 |
| `/admin/profile` | 공통 이력서 수정 |

공개 URL 예시:

```text
http://localhost:3000/resumes/AB12CD
```

## 사용 흐름

1. `/admin/profile`에서 공통 이력서를 입력합니다.
2. `/admin/resumes/new`에서 회사명, 기업별 자기소개, 지원동기를 입력합니다.
3. 저장 시 서버에서 중복되지 않는 6자리 ID를 생성합니다.
4. `/admin/resumes`에서 생성된 공개 URL을 복사합니다.
5. 공개 페이지를 미리 보거나 Markdown으로 내보내 AI 피드백을 받습니다.
6. 채용 플랫폼이나 지원서에 공개 URL을 공유합니다.

## 이력서 데이터 구조

`BaseResume`은 모든 이력서에 공통으로 사용되는 정보를 저장합니다.

- 이름
- 이메일
- 연락처
- 기본 자기소개
- 기본 지원동기
- 경력사항
- 기술스택
- 프로젝트
- 학력
- 교육
- 외부 링크

`TargetResume`은 기업별로 달라지는 정보를 저장합니다.

- 6자리 ID
- 관리자 식별용 회사명
- 기업별 자기소개
- 기업별 지원동기
- 메모

회사명은 관리자 화면과 내부 식별에 사용하지만, 공개 이력서 본문에는 표시하지 않습니다.

## Markdown 내보내기

Markdown 내보내기는 관리자 인증이 필요한 기능입니다. 내보내기 파일 상단에는 AI 피드백 요청 문구가 자동으로 포함됩니다. 이력서 내용을 AI 도구에 붙여 넣고 다음 항목을 빠르게 점검받기 위한 목적입니다.

- 강점
- 부족한 점
- 문장 개선안
- 기술스택 표현
- 기업별 자기소개와 지원동기의 설득력

## 환경변수

예시 파일을 참고해 `.env`를 생성합니다.

```env
DATABASE_URL="file:./dev.db"
BASE_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
```

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | SQLite 데이터베이스 경로 |
| `BASE_URL` | 관리자 화면에서 공개 URL을 생성할 때 사용하는 기준 주소 |
| `ADMIN_USERNAME` | 관리자 Basic Auth 사용자명 |
| `ADMIN_PASSWORD` | 관리자 Basic Auth 비밀번호 |

로컬 개발 환경이 아니라면 반드시 안전한 `ADMIN_PASSWORD`로 변경해야 합니다.

## 로컬 실행

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

브라우저에서 접속합니다.

```text
http://localhost:3000
```

관리자 페이지:

```text
http://localhost:3000/admin/resumes
```

샘플 이력서:

```text
http://localhost:3000/resumes/AB12CD
```

## 데이터베이스 명령어

Prisma Client 생성:

```bash
npm run db:generate
```

Prisma 스키마를 SQLite에 반영:

```bash
npm run db:push
```

샘플 데이터 입력:

```bash
npm run db:seed
```

## 테스트와 UI 안정성

AI를 이용해 기능을 수정하거나 추가하더라도 기존 CSS와 화면 구조가 무너지지 않도록 Playwright 기반 테스트를 사용합니다.

기능 추가나 수정은 [AI 변경 워크플로](./WORKFLOW.md)를 따릅니다. 흐름은 `프롬프트 입력 -> AI 계획 수립 -> 사용자 승인 -> 개발 -> 테스트 보고`입니다. 테스트는 계획 단계에서 먼저 범위를 정하고, 개발 완료 직후 최종 보고 전에 실행하는 것을 원칙으로 합니다.

권장 검증 순서:

```bash
npm run db:push
npm run build
npm run test:e2e
npm run test:visual
```

처음 시각 회귀 테스트 기준 이미지를 만들거나 의도적으로 디자인을 바꾼 경우에는 다음 명령으로 스냅샷을 갱신합니다.

```bash
npm run test:visual:update
```

테스트는 실제 개발 DB 대신 `file:./test.db`를 사용합니다. 테스트 시작 시 기본 이력서와 샘플 기업별 이력서를 자동으로 준비하므로, 관리자 목록과 공개 이력서 화면을 안정적으로 검증할 수 있습니다.

검증 대상:

- 공개 시작 페이지 `/`
- 기본 이력서 `/resume`
- 기업별 이력서 `/resumes/AB12CD`
- 관리자 목록 `/admin/resumes`
- 공통 이력서 수정 `/admin/profile`
- 기업별 이력서 생성 `/admin/resumes/new`
- 기업별 이력서 수정 `/admin/resumes/AB12CD/edit`

특히 버튼 정렬, 아이콘 크기, 저장 버튼 위치, 테이블 구조, 공개 이력서 문서 레이아웃이 깨지지 않는지 확인합니다.

## Docker 실행

```bash
docker compose up --build
```

기본 포트는 `3000`입니다.

`docker-compose.yml`은 호스트의 `./prisma` 디렉터리를 컨테이너의 `/app/prisma`에 마운트합니다. SQLite 파일이 컨테이너 재생성 후에도 유지되도록 하기 위한 구성입니다.

## 디자인 메모

- 공개 이력서는 개발자 이력서 템플릿을 참고한 문서형 레이아웃을 사용합니다.
- 관리자 화면은 빠른 검색과 URL 복사를 위한 테이블 중심 UI로 구성했습니다.
- URL 복사는 클릭 기반으로 동작합니다.
- 아이콘은 `lucide-react`를 사용합니다.
- 저장 버튼은 화면 오른쪽에 고정된 정사각형 아이콘 버튼으로 제공합니다.

## 프로젝트 의도

실제 지원 과정에서는 핵심 이력서는 유지하면서 회사별 자기소개와 지원동기를 조정하는 일이 자주 발생합니다. Resume Router는 이 반복 작업을 작은 웹 애플리케이션으로 정리한 프로젝트입니다.

공통 이력서, 기업별 문구, 공개 URL, Markdown 피드백 흐름을 하나로 묶어 지원 과정에서 이력서 버전을 더 쉽게 관리할 수 있도록 만드는 것이 목표입니다.
