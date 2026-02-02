"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sao_controller_1 = require("../controllers/sao.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 모든 라우트에 인증 필요
router.use(auth_1.authenticate);
// SAO 보고서 목록 조회
router.get('/', sao_controller_1.getSAOReports);
// SAO 보고서 상세 조회
router.get('/:id', sao_controller_1.getSAOReport);
// SAO 보고서 생성
router.post('/', sao_controller_1.createSAOReport);
// SAO 보고서 수정
router.put('/:id', sao_controller_1.updateSAOReport);
// SAO 보고서 삭제
router.delete('/:id', sao_controller_1.deleteSAOReport);
exports.default = router;
//# sourceMappingURL=sao.routes.js.map