# 안전순찰일지 시스템 설치 가이드

## 사전 요구사항

- Node.js 18 이상
- PostgreSQL 14 이상
- npm 또는 yarn

## 1. 데이터베이스 설정

### PostgreSQL 설치 및 데이터베이스 생성

```bash
# PostgreSQL 설치 (Windows)
# https://www.postgresql.org/download/windows/ 에서 다운로드

# 데이터베이스 생성
createdb safe_ens

# 또는 PostgreSQL 클라이언트에서:
CREATE DATABASE safe_ens;
```

### 클라우드 데이터베이스 사용 (권장)

외부 네트워크에서 접근이 필요하므로 클라우드 DB 사용을 권장합니다:

#### Supabase (무료)
1. https://supabase.com 회원가입
2. 새 프로젝트 생성
3. Database > Connection string 복사
4. 예시: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

#### AWS RDS
1. AWS Console에서 RDS > Create database
2. PostgreSQL 선택
3. 퍼블릭 액세스 활성화
4. 보안 그룹에서 5432 포트 허용
5. 엔드포인트 복사

## 2. 프로젝트 설정

### 저장소 클론 및 의존성 설치

```bash
cd d:\prj\safe_ens

# 루트에서 모든 패키지 설치
npm run install:all

# 또는 개별 설치
cd backend
npm install

cd ../frontend
npm install
```

### 환경 변수 설정

#### Backend 환경 변수 (.env)

```bash
cd backend
cp .env.example .env
```

`.env` 파일 수정:

```env
# Database (클라우드 DB URL로 변경)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# AWS S3 (사진 저장용)
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET="your-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend 환경 변수 (선택사항)

프론트엔드 루트에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. 데이터베이스 마이그레이션

```bash
cd backend

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 실행
npm run prisma:migrate

# 초기 데이터 시딩
npx ts-node prisma/seed.ts
```

## 4. 애플리케이션 실행

### 개발 모드

터미널 2개를 열어서:

```bash
# 터미널 1 - Backend
cd backend
npm run dev

# 터미널 2 - Frontend
cd frontend
npm start
```

### 빌드 및 배포

```bash
# Backend 빌드
cd backend
npm run build
npm start

# Frontend 빌드
cd frontend
npm run build
# build 폴더를 웹 서버에 배포
```

## 5. 초기 로그인 정보

시딩 후 다음 계정으로 로그인 가능합니다:

- **관리자**: admin@example.com / admin1234
- **사업소 관리자**: manager@example.com / admin1234
- **관리감독자**: supervisor1@example.com / admin1234

## 6. AWS S3 설정 (사진 업로드용)

1. AWS Console에서 S3 버킷 생성
2. 버킷 정책에서 퍼블릭 읽기 허용
3. IAM 사용자 생성 및 S3 액세스 권한 부여
4. Access Key 생성
5. `.env` 파일에 설정

## 7. 배포

### Backend 배포 (Node.js 서버)

#### Option 1: 클라우드 서버 (AWS EC2, Azure VM 등)

```bash
# 서버에 접속 후
git clone [repository-url]
cd safe_ens/backend
npm install
npm run build
npm start

# PM2로 프로세스 관리 (권장)
npm install -g pm2
pm2 start dist/server.js --name safe-ens-backend
pm2 startup
pm2 save
```

#### Option 2: Heroku

```bash
# Heroku CLI 설치 후
cd backend
heroku create safe-ens-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Frontend 배포 (정적 파일)

#### Option 1: Vercel (무료)

```bash
npm install -g vercel
cd frontend
npm run build
vercel --prod
```

#### Option 2: Netlify (무료)

1. https://app.netlify.com 로그인
2. "Add new site" > "Deploy manually"
3. `frontend/dist` 폴더 드래그 앤 드롭

#### Option 3: 자체 웹 서버 (Nginx)

```bash
cd frontend
npm run build

# dist 폴더를 웹 서버 루트로 복사
cp -r dist/* /var/www/html/
```

## 8. 프로덕션 체크리스트

- [ ] 데이터베이스 백업 설정
- [ ] JWT_SECRET 강력한 랜덤 문자열로 변경
- [ ] CORS_ORIGIN을 실제 도메인으로 변경
- [ ] SSL 인증서 설정 (HTTPS)
- [ ] 방화벽 설정
- [ ] 로그 모니터링 설정
- [ ] 정기 백업 스케줄 설정
- [ ] 기본 비밀번호 변경

## 9. 문제 해결

### 데이터베이스 연결 실패

```bash
# 연결 테스트
cd backend
npx prisma db pull
```

### 포트 충돌

```bash
# 포트 변경
# backend/.env에서 PORT 변경
# frontend/vite.config.ts에서 server.port 변경
```

### 빌드 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 10. 지원

문제가 발생하면 다음을 확인하세요:

1. Node.js 버전: `node --version` (18 이상)
2. PostgreSQL 연결: `.env`의 DATABASE_URL 확인
3. 로그 확인: `backend/` 터미널 출력
4. 브라우저 콘솔: F12 개발자 도구

## 11. 추가 기능 구현

현재 구현되지 않은 기능들:

- [ ] 사진 업로드 기능 완성 (multer + S3)
- [ ] PDF 출력 기능
- [ ] Excel 출력 기능
- [ ] 이메일 알림 (미작성자 리마인더)
- [ ] 모바일 앱 빌드 (PWA)
