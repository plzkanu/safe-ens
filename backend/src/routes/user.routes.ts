import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// 사용자 목록 조회
router.get('/', getUsers);

// 사용자 생성 (관리자만)
router.post('/', authorize('ADMIN', 'SITE_MANAGER'), createUser);

// 사용자 수정 (관리자만)
router.put('/:id', authorize('ADMIN', 'SITE_MANAGER'), updateUser);

// 사용자 삭제 (관리자만)
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
