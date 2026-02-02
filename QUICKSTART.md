# 빠른 시작 가이드

이 가이드는 로컬 개발 환경에서 시스템을 빠르게 실행하는 방법을 설명합니다.

## 전제 조건

- Node.js 18+ 설치
- PostgreSQL 설치 (또는 클라우드 DB 계정)
- Git 설치

## 5분 안에 실행하기

### 1단계: 코드 받기

이미 `d:\prj\safe_ens`에 있다면 이 단계는 건너뛰세요.

```bash
cd d:\prj
git clone [repository-url] safe_ens
cd safe_ens
```

### 2단계: 데이터베이스 준비

#### 옵션 A: 로컬 PostgreSQL

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE safe_ens;

# 종료
\q
```

#### 옵션 B: Supabase (권장)

1. https://supabase.com 회원가입
2. 새 프로젝트 생성
3. Connection string 복사

### 3단계: 환경 변수 설정

```bash
cd backend
cp .env.example .env
```

`.env` 파일 열어서 `DATABASE_URL` 수정:

```env
# 로컬 PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/safe_ens"

# 또는 Supabase
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@xxx.supabase.co:5432/postgres"
```

### 4단계: 패키지 설치

```bash
# 루트 디렉토리에서
npm run install:all

# 또는 개별 설치
cd backend
npm install

cd ../frontend
npm install
```

### 5단계: 데이터베이스 초기화

```bash
cd backend

# Prisma 클라이언트 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# 초기 데이터 생성
npm run prisma:seed
```

출력 예시:
```
🌱 데이터베이스 시딩 시작...
✅ 사업소 생성 완료
✅ 관리자 계정 생성 완료
   이메일: admin@example.com
   비밀번호: admin1234
...
🎉 시딩 완료!
```

### 6단계: 서버 실행

**두 개의 터미널**을 열어서:

```bash
# 터미널 1 - Backend
cd d:\prj\safe_ens\backend
npm run dev

# 출력:
# 🚀 Server running on port 5000
# 📝 Environment: development
```

```bash
# 터미널 2 - Frontend
cd d:\prj\safe_ens\frontend
npm start

# 출력:
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

### 7단계: 로그인

브라우저에서 http://localhost:3000 접속

**관리자 계정:**
- 이메일: `admin@example.com`
- 비밀번호: `admin1234`

**사업소 관리자:**
- 이메일: `manager@example.com`
- 비밀번호: `admin1234`

**관리감독자:**
- 이메일: `supervisor1@example.com`
- 비밀번호: `admin1234`

## 완료! 🎉

이제 시스템을 사용할 수 있습니다.

## 다음 단계

1. **비밀번호 변경**: 우측 상단 프로필 > 로그아웃 후 재로그인
2. **사업소 추가**: 사업소 관리 메뉴에서 새 사업소 생성
3. **사용자 추가**: 사용자 관리 메뉴에서 팀원 초대
4. **순찰일지 작성**: 순찰일지 메뉴에서 첫 순찰 기록

## 문제 해결

### "Database connection failed"

1. PostgreSQL이 실행 중인지 확인:
   ```bash
   # Windows
   services.msc 에서 PostgreSQL 서비스 확인
   ```

2. `.env`의 `DATABASE_URL` 확인

3. 데이터베이스 생성 여부 확인:
   ```bash
   psql -U postgres -l
   ```

### "Port 5000 is already in use"

다른 프로그램이 5000 포트를 사용 중입니다.

1. `.env`에서 포트 변경:
   ```env
   PORT=5001
   ```

2. 또는 다른 프로그램 종료:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID [PID번호] /F
   ```

### "npm install 실패"

1. Node.js 버전 확인:
   ```bash
   node --version  # v18.0.0 이상이어야 함
   ```

2. npm 캐시 삭제:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### "Prisma generate 실패"

```bash
cd backend
npx prisma generate --force
```

### 브라우저에서 "Network Error"

1. Backend 서버가 실행 중인지 확인
2. 브라우저 콘솔(F12)에서 에러 확인
3. CORS 설정 확인 (backend/.env의 CORS_ORIGIN)

## 개발 팁

### 데이터베이스 관리

```bash
# Prisma Studio 실행 (GUI)
cd backend
npm run prisma:studio

# 브라우저에서 http://localhost:5555 열림
```

### 로그 확인

Backend 터미널에서 실시간 로그 확인 가능:
```
POST /api/auth/login 200 - 15.234 ms
GET /api/users 200 - 5.123 ms
```

### 코드 변경 시

- Backend: nodemon이 자동으로 재시작
- Frontend: Vite가 자동으로 핫 리로드

### 데이터베이스 리셋

```bash
cd backend

# 데이터베이스 초기화
npx prisma migrate reset

# 다시 시드
npm run prisma:seed
```

## 추가 리소스

- [전체 설치 가이드](SETUP.md)
- [배포 가이드](DEPLOYMENT.md)
- [API 문서](API_DOCUMENTATION.md)
- [기능 목록](FEATURES.md)

## 도움이 필요하신가요?

1. 먼저 [문제 해결](#문제-해결) 섹션 확인
2. [SETUP.md](SETUP.md)의 상세 가이드 참고
3. 이슈 트래커에 문의

## 주의사항

- **프로덕션 배포 전**: `JWT_SECRET` 변경 필수
- **보안**: 기본 비밀번호는 반드시 변경
- **백업**: 중요 데이터는 정기적으로 백업
