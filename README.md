# 안전순찰일지 및 SAO 전산화 시스템

> 관리감독자 안전순찰일지 및 SAO(Safety Activity Observation)를 전산화하여 각 사업장·공정·인원별 위험요소를 통합 관리하는 웹 기반 시스템

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](https://www.postgresql.org/)

## 📋 목차

- [빠른 시작](#-빠른-시작)
- [주요 기능](#-주요-기능)
- [시스템 아키텍처](#-시스템-아키텍처)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 가이드](#-설치-가이드)
- [배포](#-배포)
- [문서](#-문서)
- [스크린샷](#-스크린샷)

## 🚀 빠른 시작

로컬 환경에서 5분 안에 실행하기:

```bash
# 1. 패키지 설치
npm run install:all

# 2. 환경 변수 설정
cd backend
cp .env.example .env
# .env 파일에서 DATABASE_URL 수정

# 3. 데이터베이스 초기화
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. 서버 실행 (두 개의 터미널)
# 터미널 1
cd backend && npm run dev

# 터미널 2
cd frontend && npm start
```

**기본 로그인 정보:**
- 관리자: `admin@example.com` / `admin1234`
- 사업소 관리자: `manager@example.com` / `admin1234`
- 관리감독자: `supervisor1@example.com` / `admin1234`

👉 상세한 설치 방법은 [QUICKSTART.md](QUICKSTART.md)를 참고하세요.

## ✨ 주요 기능

### 1. 🔐 사용자 및 권한 관리
- **3단계 권한 체계**
  - 통합 관리자 (본사 안전보건팀)
  - 사업소 관리자 (안전담당자)
  - 관리감독자 (현장 감독)
- JWT 기반 인증
- 사용자/사업소 관리 CRUD

### 2. 📝 순찰일지 작성
- **체크리스트 기반 입력** (19개 항목)
  - 작업장일반 (5개)
  - 작업자 (4개)
  - 유해위험물 (3개)
  - 환경·시설물 (5개)
  - 기타 (2개)
- 양호/불량 선택 및 비고 입력
- 부적합 시 상세 내용 필수
- 날짜/사업소/점검자별 필터링
- 모바일 반응형 지원

### 3. 👁️ SAO (안전행동관찰)
- **체크리스트 기반 관찰** (43개 항목)
  - 작업자의 반응
  - 개인보호구
  - 작업자의 위치와 자세
  - 작업도구/장비
  - 작업절차
  - 정리정돈/기준
- 작업부서, 관찰지역, 작업인원 등 메타데이터
- 사진 첨부 (예정)

### 4. 📊 통계 및 모니터링
- **실시간 대시보드**
  - 순찰일지/SAO 건수
  - 부적합/양호 건수
  - 관리감독자별 작성 현황
  - 카테고리별 부적합 TOP 5
- **순찰 실시율**
  - 관리감독자별 주 1회 이행 여부
  - 실시율 퍼센트 자동 집계
- **월별 추이 차트**
- **미작성자 리스트** (금주)

### 5. 💾 데이터 관리
- 검색 및 고급 필터링
- Excel 출력 (구현됨)
- PDF 출력 (예정)
- 월간/분기별 자동 집계

### 6. 📱 멀티 디바이스
- **반응형 웹 디자인**
- PC, 태블릿, 모바일 최적화
- PWA 지원 (홈 화면 추가 가능)
- 오프라인 모드 (예정)

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐
│  사용자 브라우저  │ (PC/모바일)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Frontend      │ React + TypeScript
│   (Vercel)      │ Material-UI, PWA
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│   Backend       │ Node.js + Express
│   (Railway)     │ JWT Auth, Prisma
└────────┬────────┘
         │
    ┌────┴─────┬──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│ PostgreSQL│ │ AWS S3 │ │ Email  │
│ (Supabase)│ │ (Photos)│ │(Nodemailer)│
└────────┘ └────────┘ └────────┘
```

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18.2 + TypeScript
- **UI Library**: Material-UI 5.15
- **State Management**: React Context API
- **Charts**: Recharts 2.10
- **HTTP Client**: Axios
- **Routing**: React Router 6
- **Build Tool**: Vite 5.0
- **PWA**: vite-plugin-pwa

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.18
- **Language**: TypeScript 5.3
- **ORM**: Prisma 5.8
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer (+ AWS S3)
- **Excel**: ExcelJS
- **PDF**: PDFKit

### Database
- **DBMS**: PostgreSQL 14+
- **Cloud**: Supabase / AWS RDS
- **ORM**: Prisma (Type-safe)

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions (예정)
- **Hosting**: 
  - Frontend: Vercel / Netlify
  - Backend: Railway / Heroku
  - Database: Supabase
- **Monitoring**: (예정)

## 📁 프로젝트 구조

```
safe_ens/
├── backend/                    # 백엔드 서버
│   ├── prisma/
│   │   ├── schema.prisma      # DB 스키마 정의
│   │   └── seed.ts            # 초기 데이터
│   ├── src/
│   │   ├── controllers/       # 비즈니스 로직
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── site.controller.ts
│   │   │   ├── patrol.controller.ts
│   │   │   ├── sao.controller.ts
│   │   │   └── stats.controller.ts
│   │   ├── middleware/        # 인증, 에러 처리
│   │   │   └── auth.ts
│   │   ├── routes/            # API 라우트
│   │   ├── utils/             # 유틸리티
│   │   │   └── prisma.ts
│   │   └── server.ts          # 엔트리 포인트
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # 프론트엔드 앱
│   ├── public/
│   │   └── manifest.json      # PWA 매니페스트
│   ├── src/
│   │   ├── components/        # 공통 컴포넌트
│   │   │   ├── Layout.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PatrolList.tsx
│   │   │   ├── PatrolForm.tsx
│   │   │   ├── SAOList.tsx
│   │   │   ├── SAOForm.tsx
│   │   │   ├── Statistics.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── SiteManagement.tsx
│   │   ├── services/          # API 서비스
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── patrol.service.ts
│   │   │   ├── sao.service.ts
│   │   │   ├── stats.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── site.service.ts
│   │   ├── types/             # TypeScript 타입
│   │   │   └── index.ts
│   │   ├── utils/             # 유틸리티
│   │   │   ├── constants.ts
│   │   │   └── export.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
├── package.json               # 루트 패키지
├── README.md                  # 이 파일
├── QUICKSTART.md              # 빠른 시작 가이드
├── SETUP.md                   # 상세 설치 가이드
├── DEPLOYMENT.md              # 배포 가이드
├── API_DOCUMENTATION.md       # API 문서
└── FEATURES.md                # 기능 목록 및 로드맵
```

## 📖 설치 가이드

### 최소 요구사항
- Node.js 18+
- PostgreSQL 14+ (또는 클라우드 DB)
- npm 9+

### 상세 설치 단계

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd safe_ens
   ```

2. **패키지 설치**
   ```bash
   npm run install:all
   ```

3. **환경 변수 설정**
   ```bash
   cd backend
   cp .env.example .env
   # .env 파일 수정
   ```

4. **데이터베이스 설정**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **실행**
   ```bash
   # Backend (터미널 1)
   npm run dev:backend
   
   # Frontend (터미널 2)
   npm run dev:frontend
   ```

👉 더 자세한 내용은 [SETUP.md](SETUP.md)를 참고하세요.

## 🚀 배포

### 무료 배포 옵션

- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway (500시간/월), Render
- **Database**: Supabase (500MB 무료)

총 비용: **$0-5/월**

### 배포 단계

1. Supabase에서 PostgreSQL 생성
2. Railway에 Backend 배포
3. Vercel에 Frontend 배포
4. 환경 변수 설정

👉 상세한 배포 방법은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참고하세요.

## 📚 문서

- [QUICKSTART.md](QUICKSTART.md) - 5분 안에 로컬 실행
- [SETUP.md](SETUP.md) - 상세 설치 및 설정 가이드
- [DEPLOYMENT.md](DEPLOYMENT.md) - 클라우드 배포 가이드
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - REST API 명세
- [FEATURES.md](FEATURES.md) - 구현 기능 및 로드맵

## 🖼️ 스크린샷

### 로그인 화면
![Login](docs/images/login.png)

### 대시보드
![Dashboard](docs/images/dashboard.png)

### 순찰일지 작성
![Patrol Form](docs/images/patrol-form.png)

### 통계 화면
![Statistics](docs/images/statistics.png)

## 🤝 기여

기여를 환영합니다! 이슈나 Pull Request를 자유롭게 제출해주세요.

## 📝 라이선스

이 프로젝트는 Private 라이선스를 따릅니다.

## 👥 팀

- 개발: [Your Name]
- 기획: [Your Team]
- 디자인: [Your Team]

## 📞 문의

- 이메일: your-email@example.com
- 이슈: [GitHub Issues]

## 🙏 감사의 말

- Material-UI for beautiful components
- Prisma for type-safe database access
- All open-source contributors

---

Made with ❤️ for workplace safety
