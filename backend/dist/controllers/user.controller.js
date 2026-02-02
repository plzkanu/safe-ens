"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
// 사용자 목록 조회
const getUsers = async (req, res) => {
    try {
        const { siteId, role, search } = req.query;
        const where = {};
        if (siteId) {
            where.siteId = siteId;
        }
        if (role) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const users = await prisma_1.default.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                siteId: true,
                site: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: '사용자 목록 조회 중 오류가 발생했습니다.' });
    }
};
exports.getUsers = getUsers;
// 사용자 생성
const createUser = async (req, res) => {
    try {
        const { email, password, name, role, siteId } = req.body;
        // 이메일 중복 확인
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });
        }
        // 비밀번호 해시화
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 사용자 생성
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                siteId: siteId || null
            },
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
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
    }
};
exports.createUser = createUser;
// 사용자 수정
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role, siteId, password } = req.body;
        const data = { email, name, role };
        if (siteId !== undefined) {
            data.siteId = siteId || null;
        }
        if (password) {
            data.password = await bcryptjs_1.default.hash(password, 10);
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
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
        res.json(user);
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: '사용자 수정 중 오류가 발생했습니다.' });
    }
};
exports.updateUser = updateUser;
// 사용자 삭제
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.user.delete({
            where: { id }
        });
        res.json({ message: '사용자가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: '사용자 삭제 중 오류가 발생했습니다.' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map