import { Router } from 'express';
import { getSites, getSite, createSite, updateSite, deleteSite } from '../controllers/site.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// 사업소 목록 조회
router.get('/', getSites);

// 사업소 상세 조회
router.get('/:id', getSite);

// 사업소 생성 (관리자만)
router.post('/', authorize('ADMIN'), createSite);

// 사업소 수정 (관리자만)
router.put('/:id', authorize('ADMIN'), updateSite);

// 사업소 삭제 (관리자만)
router.delete('/:id', authorize('ADMIN'), deleteSite);

export default router;
