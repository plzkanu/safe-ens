import { Router } from 'express';
import {
  getSAOReports,
  getSAOReport,
  createSAOReport,
  updateSAOReport,
  deleteSAOReport
} from '../controllers/sao.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// SAO 보고서 목록 조회
router.get('/', getSAOReports);

// SAO 보고서 상세 조회
router.get('/:id', getSAOReport);

// SAO 보고서 생성
router.post('/', createSAOReport);

// SAO 보고서 수정
router.put('/:id', updateSAOReport);

// SAO 보고서 삭제
router.delete('/:id', deleteSAOReport);

export default router;
