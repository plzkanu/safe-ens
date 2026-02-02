"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
// 로그인
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 사용자 찾기
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { site: true }
        });
        if (!user) {
            res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            return;
        }
        // 비밀번호 확인
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            return;
        }
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            siteId: user.siteId
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                site: user.site
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
};
exports.login = login;
// 내 정보 조회
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                siteId: true,
                site: true,
                createdAt: true
            }
        });
        if (!user) {
            res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: '사용자 정보 조회 중 오류가 발생했습니다.' });
    }
};
exports.getMe = getMe;
// 비밀번호 변경
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        // 현재 사용자 조회
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
            return;
        }
        // 현재 비밀번호 확인
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
            return;
        }
        // 새 비밀번호 해시화
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        // 비밀번호 업데이트
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({ message: '비밀번호가 변경되었습니다.' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map