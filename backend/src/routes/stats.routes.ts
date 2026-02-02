import { Router } from 'express';
import {
  getDashboardStats,
  getComplianceRate,
  getMonthlyTrend,
  getNonCompliantUsers
} from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticate);

// 전체 대시보드 통계
router.get('/dashboard', getDashboardStats);

// 순찰 실시율
router.get('/compliance', getComplianceRate);

// 월별 추이
router.get('/trend/monthly', getMonthlyTrend);

// 미작성자 리스트
router.get('/non-compliant', getNonCompliantUsers);

export default router;
