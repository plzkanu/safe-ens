"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 모든 라우트에 인증 필요
router.use(auth_1.authenticate);
// 사용자 목록 조회
router.get('/', user_controller_1.getUsers);
// 사용자 생성 (관리자만)
router.post('/', (0, auth_1.authorize)('ADMIN', 'SITE_MANAGER'), user_controller_1.createUser);
// 사용자 수정 (관리자만)
router.put('/:id', (0, auth_1.authorize)('ADMIN', 'SITE_MANAGER'), user_controller_1.updateUser);
// 사용자 삭제 (관리자만)
router.delete('/:id', (0, auth_1.authorize)('ADMIN'), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map