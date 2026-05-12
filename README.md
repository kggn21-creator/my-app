# 공동육아 어린이집 지출 관리 시스템

공동육아 어린이집의 지출 신청·승인·증빙을 디지털로 전환하는 역할 기반 지출 관리 웹 애플리케이션입니다.

## 주요 기능

- **역할 기반 접근 제어**: 조합원 / 교사 / 재정이사 / 관리자
- **지출 신청**: 소위원회별 지출 신청서 작성 및 증빙 파일 첨부
- **사전 승인 체계**: 재정이사 승인 → 관리자 지출 완료 처리
- **처리 이력 타임라인**: 모든 상태 변경 이력 기록
- **관리자 대시보드**: 대기 건 현황 및 통계 조회

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (Strict Mode) |
| Database | SQLite (로컬) → NeonDB/Supabase (프로덕션) |
| ORM | Prisma 7 + @prisma/adapter-libsql |
| Auth | NextAuth.js v5 |
| Styling | CSS Modules + Design Tokens |

## 로컬 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 값을 채워주세요:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-secret-key"      # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 마이그레이션

```bash
npx prisma migrate deploy
```

### 4. 시드 데이터 (선택사항)

```bash
npm run db:seed
```

기본 계정 (비밀번호: `password123`):
- 관리자: `admin@childcare.kr`
- 재정이사: `finance@childcare.kr`
- 교사: `teacher@childcare.kr`
- 조합원: `member@childcare.kr`

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 환경변수 목록

| 변수 | 설명 | 출처 |
|------|------|------|
| `DATABASE_URL` | DB 연결 문자열. 로컬: SQLite 파일 경로, 프로덕션: NeonDB/Supabase Connection Pooling URL | NeonDB 대시보드 또는 Supabase 대시보드 |
| `AUTH_SECRET` | NextAuth.js 세션 서명 비밀키 (32바이트 이상 랜덤 문자열) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 애플리케이션의 공개 접근 URL | 로컬: `http://localhost:3000`, 배포: Vercel 도메인 |

## Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소를 연결합니다.
2. 환경변수를 Vercel 대시보드에 등록합니다 (`.env.example` 참고).
3. `DATABASE_URL`을 NeonDB 또는 Supabase의 연결 문자열로 교체합니다.
4. 배포 전 `npx prisma migrate deploy`를 실행해 스키마를 적용합니다.
