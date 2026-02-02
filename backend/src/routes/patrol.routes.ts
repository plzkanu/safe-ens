import { Router } from 'express';
import {
  getPatrolLogs,
  getPatrolLog,
  createPatrolLog,
  updatePatrolLog,
  deletePatrolLog,
  uploadPatrolItemPhoto
} from '../controllers/patrol.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// 순찰일지 목록 조회
router.get('/', getPatrolLogs);

// 순찰일지 상세 조회
router.get('/:id', getPatrolLog);

// 순찰일지 생성
router.post('/', createPatrolLog);

// 순찰일지 수정
router.put('/:id', updatePatrolLog);

// 순찰일지 삭제
router.delete('/:id', deletePatrolLog);

// 순찰 항목 사진 업로드
router.post('/items/:itemId/photos', uploadPatrolItemPhoto);

export default router;
