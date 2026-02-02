"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSite = exports.updateSite = exports.createSite = exports.getSite = exports.getSites = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// 사업소 목록 조회
const getSites = async (req, res) => {
    try {
        const sites = await prisma_1.default.site.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        patrolLogs: true,
                        saoReports: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(sites);
    }
    catch (error) {
        console.error('Get sites error:', error);
        res.status(500).json({ error: '사업소 목록 조회 중 오류가 발생했습니다.' });
    }
};
exports.getSites = getSites;
// 사업소 상세 조회
const getSite = async (req, res) => {
    try {
        const { id } = req.params;
        const site = await prisma_1.default.site.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                _count: {
                    select: {
                        patrolLogs: true,
                        saoReports: true
                    }
                }
            }
        });
        if (!site) {
            return res.status(404).json({ error: '사업소를 찾을 수 없습니다.' });
        }
        res.json(site);
    }
    catch (error) {
        console.error('Get site error:', error);
        res.status(500).json({ error: '사업소 조회 중 오류가 발생했습니다.' });
    }
};
exports.getSite = getSite;
// 사업소 생성
const createSite = async (req, res) => {
    try {
        const { name, code, address, description } = req.body;
        // 코드 중복 확인
        const existingSite = await prisma_1.default.site.findUnique({
            where: { code }
        });
        if (existingSite) {
            return res.status(400).json({ error: '이미 존재하는 사업소 코드입니다.' });
        }
        const site = await prisma_1.default.site.create({
            data: {
                name,
                code,
                address,
                description
            }
        });
        res.status(201).json(site);
    }
    catch (error) {
        console.error('Create site error:', error);
        res.status(500).json({ error: '사업소 생성 중 오류가 발생했습니다.' });
    }
};
exports.createSite = createSite;
// 사업소 수정
const updateSite = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, address, description } = req.body;
        const site = await prisma_1.default.site.update({
            where: { id },
            data: {
                name,
                code,
                address,
                description
            }
        });
        res.json(site);
    }
    catch (error) {
        console.error('Update site error:', error);
        res.status(500).json({ error: '사업소 수정 중 오류가 발생했습니다.' });
    }
};
exports.updateSite = updateSite;
// 사업소 삭제
const deleteSite = async (req, res) => {
    try {
        const { id } = req.params;
        // 사업소에 속한 사용자가 있는지 확인
        const userCount = await prisma_1.default.user.count({
            where: { siteId: id }
        });
        if (userCount > 0) {
            return res.status(400).json({
                error: '사업소에 속한 사용자가 있어 삭제할 수 없습니다.'
            });
        }
        await prisma_1.default.site.delete({
            where: { id }
        });
        res.json({ message: '사업소가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete site error:', error);
        res.status(500).json({ error: '사업소 삭제 중 오류가 발생했습니다.' });
    }
};
exports.deleteSite = deleteSite;
//# sourceMappingURL=site.controller.js.map