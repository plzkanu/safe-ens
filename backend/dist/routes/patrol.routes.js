"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patrol_controller_1 = require("../controllers/patrol.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 모든 라우트에 인증 필요
router.use(auth_1.authenticate);
// 순찰일지 목록 조회
router.get('/', patrol_controller_1.getPatrolLogs);
// 순찰일지 상세 조회
router.get('/:id', patrol_controller_1.getPatrolLog);
// 순찰일지 생성
router.post('/', patrol_controller_1.createPatrolLog);
// 순찰일지 수정
router.put('/:id', patrol_controller_1.updatePatrolLog);
// 순찰일지 삭제
router.delete('/:id', patrol_controller_1.deletePatrolLog);
// 순찰 항목 사진 업로드
router.post('/items/:itemId/photos', patrol_controller_1.uploadPatrolItemPhoto);
exports.default = router;
//# sourceMappingURL=patrol.routes.js.map