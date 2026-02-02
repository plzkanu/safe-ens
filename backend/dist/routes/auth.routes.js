"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// 로그인
router.post('/login', auth_controller_1.login);
// 내 정보 조회
router.get('/me', auth_1.authenticate, auth_controller_1.getMe);
// 비밀번호 변경
router.post('/change-password', auth_1.authenticate, auth_controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map