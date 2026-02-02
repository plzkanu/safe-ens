"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 모든 라우트에 인증 필요
router.use(auth_1.authenticate);
// 전체 대시보드 통계
router.get('/dashboard', stats_controller_1.getDashboardStats);
// 순찰 실시율
router.get('/compliance', stats_controller_1.getComplianceRate);
// 월별 추이
router.get('/trend/monthly', stats_controller_1.getMonthlyTrend);
// 미작성자 리스트
router.get('/non-compliant', stats_controller_1.getNonCompliantUsers);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map