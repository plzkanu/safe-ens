"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const site_controller_1 = require("../controllers/site.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 모든 라우트에 인증 필요
router.use(auth_1.authenticate);
// 사업소 목록 조회
router.get('/', site_controller_1.getSites);
// 사업소 상세 조회
router.get('/:id', site_controller_1.getSite);
// 사업소 생성 (관리자만)
router.post('/', (0, auth_1.authorize)('ADMIN'), site_controller_1.createSite);
// 사업소 수정 (관리자만)
router.put('/:id', (0, auth_1.authorize)('ADMIN'), site_controller_1.updateSite);
// 사업소 삭제 (관리자만)
router.delete('/:id', (0, auth_1.authorize)('ADMIN'), site_controller_1.deleteSite);
exports.default = router;
//# sourceMappingURL=site.routes.js.map