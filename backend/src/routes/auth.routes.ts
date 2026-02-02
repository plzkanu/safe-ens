import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 로그인
router.post('/login', login);

// 내 정보 조회
router.get('/me', authenticate, getMe);

// 비밀번호 변경
router.post('/change-password', authenticate, changePassword);

export default router;
