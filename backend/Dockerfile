# Backend Dockerfile (선택사항)

FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./
COPY prisma ./prisma/

# 의존성 설치
RUN npm ci

# Prisma 클라이언트 생성
RUN npx prisma generate

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 포트 노출
EXPOSE 5000

# 프로덕션 실행
CMD ["npm", "start"]
