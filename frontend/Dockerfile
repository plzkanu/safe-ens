# Frontend Dockerfile (선택사항)

FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
