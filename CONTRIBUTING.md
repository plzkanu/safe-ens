# 기여 가이드

안전순찰일지 시스템에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 설명합니다.

## 목차

- [코드 스타일](#코드-스타일)
- [개발 프로세스](#개발-프로세스)
- [커밋 메시지](#커밋-메시지)
- [Pull Request](#pull-request)
- [이슈 리포팅](#이슈-리포팅)

## 코드 스타일

### TypeScript

- **들여쓰기**: 2 spaces
- **세미콜론**: 사용
- **따옴표**: 싱글 쿼트 (')
- **네이밍**:
  - 변수/함수: camelCase
  - 클래스/인터페이스: PascalCase
  - 상수: UPPER_SNAKE_CASE
  - 파일명: kebab-case

### React

- **함수형 컴포넌트** 사용
- **Hooks** 사용 (useState, useEffect 등)
- **Props 타입** 명시
- **컴포넌트명**: PascalCase

### 예시

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Bad
interface user {
  ID: string;
  Name: string;
  Email: string;
}

function GetUserById(id) {
  return api.get('/users/' + id).then(res => res.data);
}
```

## 개발 프로세스

1. **Fork** 저장소
2. **Branch** 생성
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **코드 작성** 및 테스트
4. **Commit**
5. **Push** to your fork
6. **Pull Request** 생성

### Branch 네이밍

- `feature/` - 새로운 기능
- `fix/` - 버그 수정
- `refactor/` - 리팩토링
- `docs/` - 문서 수정
- `test/` - 테스트 추가/수정

예시:
- `feature/add-photo-upload`
- `fix/login-redirect-bug`
- `refactor/api-service-structure`

## 커밋 메시지

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 설정 변경

### 예시

```
feat(patrol): 사진 업로드 기능 추가

- Multer 미들웨어 설정
- S3 업로드 로직 구현
- 프론트엔드 파일 선택 UI 추가

Closes #123
```

```
fix(auth): 토큰 만료 시 자동 로그아웃 안되는 버그 수정

만료된 토큰으로 API 요청 시 401 응답을 받으면
자동으로 로그아웃 처리하도록 수정
```

## Pull Request

### 체크리스트

- [ ] 코드가 정상 동작함
- [ ] 기존 테스트가 통과함
- [ ] 새로운 기능에 대한 테스트 추가 (해당시)
- [ ] 문서 업데이트 (해당시)
- [ ] 린트 에러 없음
- [ ] 커밋 메시지가 규칙을 따름

### PR 템플릿

```markdown
## 변경 사항

무엇을 변경했는지 설명

## 관련 이슈

Closes #123

## 테스트

어떻게 테스트했는지 설명

## 스크린샷 (UI 변경시)

변경 전/후 스크린샷

## 체크리스트

- [ ] 코드가 정상 동작함
- [ ] 테스트 추가/업데이트
- [ ] 문서 업데이트
```

## 이슈 리포팅

### 버그 리포트

```markdown
## 버그 설명

무슨 문제가 발생하는지

## 재현 방법

1. '...' 페이지로 이동
2. '....' 버튼 클릭
3. 에러 발생

## 예상 동작

어떻게 동작해야 하는지

## 실제 동작

실제로 어떻게 동작하는지

## 환경

- OS: Windows 10
- 브라우저: Chrome 120
- 버전: 1.0.0

## 스크린샷

에러 스크린샷
```

### 기능 제안

```markdown
## 기능 설명

어떤 기능을 원하는지

## 문제/동기

왜 이 기능이 필요한지

## 제안하는 해결책

어떻게 구현할지

## 대안

다른 방법은 없는지
```

## 코드 리뷰

### 리뷰어

- 코드가 요구사항을 충족하는지 확인
- 코드 스타일이 일관적인지 확인
- 성능 이슈가 없는지 확인
- 보안 이슈가 없는지 확인
- 테스트가 충분한지 확인

### 리뷰이

- 리뷰 코멘트에 대응
- 질문에 답변
- 필요시 코드 수정
- 모든 리뷰가 resolved 되면 merge 요청

## 테스트

현재 테스트 코드가 없지만, 추후 추가 예정:

```typescript
// 예시
describe('AuthService', () => {
  it('should login with valid credentials', async () => {
    const result = await authService.login('test@example.com', 'password');
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw error with invalid credentials', async () => {
    await expect(
      authService.login('test@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials');
  });
});
```

## 질문?

질문이 있으면:
- GitHub Issues에 질문 등록
- 이메일: your-email@example.com

## 감사합니다!

모든 기여자에게 감사드립니다. 여러분의 기여가 이 프로젝트를 더 좋게 만듭니다.
