# 배포 가이드

## 외부 네트워크 접근을 위한 클라우드 배포

### 아키텍처

```
[사용자 브라우저/모바일]
         ↓
[Frontend - Vercel/Netlify]
         ↓
[Backend API - Heroku/Railway]
         ↓
[Database - Supabase/AWS RDS]
```

## 1. 데이터베이스 배포 (Supabase)

### 단계

1. https://supabase.com 회원가입
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호 설정
4. 지역 선택 (Northeast Asia 권장)
5. "Create new project" 클릭
6. Project Settings > Database > Connection string 복사

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

## 2. Backend API 배포 (Railway)

### Railway 사용 (무료 500시간/월)

1. https://railway.app 회원가입 (GitHub 연동)
2. "New Project" > "Deploy from GitHub repo"
3. 저장소 선택
4. Root Directory를 `backend`로 설정
5. 환경 변수 설정:

```env
DATABASE_URL=<Supabase connection string>
JWT_SECRET=<random-secret-key>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=5000
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=<your-bucket>
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

6. "Deploy" 클릭
7. 배포 URL 확인 (예: `https://safe-ens-backend.up.railway.app`)

### 데이터베이스 마이그레이션

Railway 터미널에서:

```bash
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

## 3. Frontend 배포 (Vercel)

1. https://vercel.com 회원가입 (GitHub 연동)
2. "New Project" > Import Git Repository
3. Root Directory를 `frontend`로 설정
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. 환경 변수 설정:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

7. "Deploy" 클릭
8. 배포 URL 확인 (예: `https://safe-ens.vercel.app`)

## 4. 도메인 연결 (선택사항)

### Vercel (Frontend)

1. Project Settings > Domains
2. 도메인 입력 (예: `patrol.yourcompany.com`)
3. DNS 설정 (CNAME 레코드 추가)

### Railway (Backend)

1. Project Settings > Domains
2. Custom Domain 추가
3. DNS 설정 (CNAME 레코드 추가)

## 5. AWS S3 설정 (사진 저장)

1. AWS Console > S3 > "Create bucket"
2. 버킷 이름: `safe-ens-photos`
3. 지역: Asia Pacific (Seoul)
4. "Block all public access" 체크 해제
5. "Create bucket"

### CORS 설정

버킷 > Permissions > CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-frontend-domain.vercel.app"],
    "ExposeHeaders": []
  }
]
```

### IAM 사용자 생성

1. IAM > Users > "Add users"
2. Access type: Programmatic access
3. Permissions: AmazonS3FullAccess
4. Access Key ID와 Secret Access Key 저장

## 6. 대안 배포 옵션

### Backend

- **Heroku** (무료 플랜 종료): https://www.heroku.com
- **Render** (무료): https://render.com
- **Fly.io** (무료 티어): https://fly.io
- **Railway** (추천, 무료 500시간): https://railway.app

### Frontend

- **Vercel** (추천, 무료): https://vercel.com
- **Netlify** (무료): https://netlify.com
- **Cloudflare Pages** (무료): https://pages.cloudflare.com

### Database

- **Supabase** (추천, 무료 500MB): https://supabase.com
- **Neon** (무료 512MB): https://neon.tech
- **ElephantSQL** (무료 20MB): https://www.elephantsql.com
- **Railway** (PostgreSQL): https://railway.app

## 7. 모바일 접근 (PWA)

프론트엔드는 PWA로 구성되어 있어 모바일에서 앱처럼 사용 가능:

1. 모바일 브라우저에서 사이트 접속
2. "홈 화면에 추가" 선택
3. 앱 아이콘 생성됨

## 8. 보안 설정

### Backend

1. CORS 설정 확인
2. JWT Secret 강력한 키로 변경
3. Rate Limiting 추가 (선택)
4. HTTPS 강제

### Frontend

1. 환경 변수에 민감 정보 저장하지 않기
2. CSP (Content Security Policy) 설정

## 9. 모니터링

### Backend 로그

Railway/Render 대시보드에서 실시간 로그 확인

### 에러 추적 (선택)

- Sentry: https://sentry.io
- LogRocket: https://logrocket.com

## 10. 백업 전략

### 데이터베이스

Supabase는 자동 백업 제공:
- Project Settings > Database > Backups

수동 백업:

```bash
# Supabase CLI 설치
npm install -g supabase

# 백업
supabase db dump > backup.sql

# 복원
supabase db restore backup.sql
```

## 11. 스케일링

트래픽 증가 시:

1. **Database**: Supabase Pro 플랜 ($25/월)
2. **Backend**: Railway Pro 플랜 ($5/월)
3. **Frontend**: Vercel Pro 플랜 ($20/월)
4. **Storage**: AWS S3 (사용량 기반)

## 12. CI/CD

GitHub Actions 자동 배포:

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway CLI 배포 커맨드

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          # Vercel CLI 배포 커맨드
```

## 13. 비용 예측

무료 티어 사용 시:

- Database (Supabase): $0
- Backend (Railway): $0 (500시간/월)
- Frontend (Vercel): $0
- Storage (AWS S3): ~$1-5/월 (사진 용량에 따라)

**총 비용: $0-5/월**

유료 플랜 사용 시:

- Database: $25/월
- Backend: $5/월
- Frontend: $20/월
- Storage: $5-20/월

**총 비용: $55-70/월**

## 14. 체크리스트

배포 전 확인사항:

- [ ] 환경 변수 모두 설정
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 초기 데이터 시딩 완료
- [ ] CORS 설정 확인
- [ ] SSL/HTTPS 활성화
- [ ] 기본 계정 비밀번호 변경
- [ ] S3 버킷 권한 확인
- [ ] 모바일 반응형 테스트
- [ ] 브라우저 호환성 테스트
- [ ] 성능 테스트

## 15. 문제 해결

### "Database connection failed"

1. DATABASE_URL 형식 확인
2. Supabase 프로젝트 상태 확인
3. IP 화이트리스트 설정 (필요시)

### "CORS error"

1. Backend CORS_ORIGIN 설정 확인
2. Frontend URL과 일치하는지 확인
3. 프로토콜 (https://) 포함 여부 확인

### "Build failed"

1. Node.js 버전 확인
2. 환경 변수 설정 확인
3. 의존성 버전 충돌 확인
