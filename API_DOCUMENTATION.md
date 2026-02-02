# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

모든 API는 JWT 토큰 기반 인증을 사용합니다. (로그인 제외)

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
로그인

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin1234"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "관리자",
    "role": "ADMIN",
    "site": null
  }
}
```

#### GET /auth/me
현재 사용자 정보 조회

**Response:**
```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "관리자",
  "role": "ADMIN",
  "siteId": null,
  "site": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /auth/change-password
비밀번호 변경

**Request:**
```json
{
  "currentPassword": "admin1234",
  "newPassword": "newpassword123"
}
```

### Users

#### GET /users
사용자 목록 조회

**Query Parameters:**
- `siteId`: 사업소 ID
- `role`: 역할 (ADMIN, SITE_MANAGER, SUPERVISOR)
- `search`: 검색어 (이름, 이메일)

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "사용자",
    "role": "SUPERVISOR",
    "siteId": "uuid",
    "site": {
      "id": "uuid",
      "name": "본사",
      "code": "SITE001"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /users
사용자 생성 (관리자만)

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "새 사용자",
  "role": "SUPERVISOR",
  "siteId": "uuid"
}
```

#### PUT /users/:id
사용자 수정 (관리자만)

**Request:**
```json
{
  "email": "updated@example.com",
  "name": "수정된 이름",
  "role": "SITE_MANAGER",
  "siteId": "uuid",
  "password": "newpassword" // 선택사항
}
```

#### DELETE /users/:id
사용자 삭제 (관리자만)

### Sites

#### GET /sites
사업소 목록 조회

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "본사",
    "code": "SITE001",
    "address": "서울특별시 강남구",
    "description": "본사 사업소",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "users": 5,
      "patrolLogs": 20,
      "saoReports": 15
    }
  }
]
```

#### GET /sites/:id
사업소 상세 조회

#### POST /sites
사업소 생성 (관리자만)

**Request:**
```json
{
  "name": "새 사업소",
  "code": "SITE003",
  "address": "대전광역시",
  "description": "대전 사업소"
}
```

#### PUT /sites/:id
사업소 수정 (관리자만)

#### DELETE /sites/:id
사업소 삭제 (관리자만)

### Patrol Logs

#### GET /patrol
순찰일지 목록 조회

**Query Parameters:**
- `siteId`: 사업소 ID
- `inspectorId`: 점검자 ID
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)
- `page`: 페이지 번호 (기본: 1)
- `limit`: 페이지 크기 (기본: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "inspector": {
        "id": "uuid",
        "name": "김관리",
        "email": "supervisor@example.com"
      },
      "site": {
        "id": "uuid",
        "name": "본사",
        "code": "SITE001"
      },
      "inspectionDate": "2024-01-15T00:00:00.000Z",
      "department": "생산팀",
      "location": "1공장",
      "approved": false,
      "items": [
        {
          "id": "uuid",
          "category": "작업장일반",
          "itemNumber": 1,
          "itemText": "위험하게 적치되거나 방치된 자재 및 재료는 없는가?",
          "status": "GOOD",
          "notes": "",
          "photos": []
        }
      ],
      "notes": "특이사항 없음",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

#### GET /patrol/:id
순찰일지 상세 조회

#### POST /patrol
순찰일지 생성

**Request:**
```json
{
  "siteId": "uuid",
  "inspectionDate": "2024-01-15",
  "department": "생산팀",
  "location": "1공장",
  "notes": "특이사항 없음",
  "items": [
    {
      "category": "작업장일반",
      "itemNumber": 1,
      "itemText": "위험하게 적치되거나 방치된 자재 및 재료는 없는가?",
      "status": "GOOD",
      "notes": ""
    }
  ]
}
```

#### PUT /patrol/:id
순찰일지 수정

#### DELETE /patrol/:id
순찰일지 삭제

### SAO Reports

#### GET /sao
SAO 보고서 목록 조회

**Query Parameters:** (순찰일지와 동일)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "inspector": {...},
      "site": {...},
      "reportDate": "2024-01-15T00:00:00.000Z",
      "reportTime": "14:30",
      "workplace": "생산1팀",
      "workArea": "1공장 A라인",
      "workType": "점검/경비",
      "workShift": "교대",
      "observerCount": 1,
      "workerCount": 5,
      "workResponse": "안전모 미착용 지적 후 착용 완료",
      "items": [
        {
          "id": "uuid",
          "category": "개인보호구",
          "itemNumber": 1,
          "itemText": "머리(안전모)",
          "checked": true,
          "notes": "미착용자 1명 발견",
          "photos": []
        }
      ],
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

#### GET /sao/:id
SAO 보고서 상세 조회

#### POST /sao
SAO 보고서 생성

**Request:**
```json
{
  "siteId": "uuid",
  "reportDate": "2024-01-15",
  "reportTime": "14:30",
  "workplace": "생산1팀",
  "workArea": "1공장 A라인",
  "workType": "점검/경비",
  "workShift": "교대",
  "observerCount": 1,
  "workerCount": 5,
  "workResponse": "안전모 미착용 지적 후 착용 완료",
  "items": [
    {
      "category": "개인보호구",
      "itemNumber": 1,
      "itemText": "머리(안전모)",
      "checked": true,
      "notes": "미착용자 1명 발견"
    }
  ]
}
```

#### PUT /sao/:id
SAO 보고서 수정

#### DELETE /sao/:id
SAO 보고서 삭제

### Statistics

#### GET /stats/dashboard
대시보드 통계

**Query Parameters:**
- `siteId`: 사업소 ID
- `startDate`: 시작일
- `endDate`: 종료일

**Response:**
```json
{
  "summary": {
    "totalPatrols": 50,
    "totalSAOs": 30,
    "badItemsCount": 15,
    "goodItemsCount": 235
  },
  "inspectorStats": [
    {
      "id": "uuid",
      "name": "김관리",
      "patrolCount": 10,
      "badItemsCount": 3
    }
  ],
  "categoryStats": [
    {
      "category": "작업장일반",
      "count": 5
    }
  ],
  "recentPatrols": [...],
  "recentSAOs": [...]
}
```

#### GET /stats/compliance
순찰 실시율

**Query Parameters:**
- `siteId`: 사업소 ID
- `startDate`: 시작일
- `endDate`: 종료일

**Response:**
```json
{
  "period": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-31T00:00:00.000Z"
  },
  "data": [
    {
      "supervisor": {
        "id": "uuid",
        "name": "김관리",
        "email": "supervisor@example.com"
      },
      "patrolCount": 4,
      "expectedCount": 4,
      "complianceRate": 100,
      "isCompliant": true
    }
  ]
}
```

#### GET /stats/trend/monthly
월별 추이

**Query Parameters:**
- `siteId`: 사업소 ID
- `months`: 개월 수 (기본: 6)

**Response:**
```json
{
  "data": [
    {
      "month": "2024-01",
      "patrolCount": 20,
      "goodCount": 180,
      "badCount": 15
    }
  ]
}
```

#### GET /stats/non-compliant
미작성자 리스트

**Query Parameters:**
- `siteId`: 사업소 ID

**Response:**
```json
{
  "period": {
    "start": "2024-01-15T00:00:00.000Z"
  },
  "nonCompliantUsers": [
    {
      "user": {
        "id": "uuid",
        "name": "이감독",
        "email": "supervisor2@example.com",
        "site": {
          "name": "본사"
        }
      },
      "hasPatrolThisWeek": false,
      "patrolCount": 0
    }
  ]
}
```

## Error Responses

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": "에러 메시지"
}
```

### HTTP Status Codes

- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

## Rate Limiting

현재 Rate Limiting은 구현되어 있지 않습니다. 프로덕션 환경에서는 구현 권장.

## Pagination

페이지네이션이 적용된 API는 다음 형식으로 응답:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```
