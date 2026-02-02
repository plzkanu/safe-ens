"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPatrolItemPhoto = exports.deletePatrolLog = exports.updatePatrolLog = exports.createPatrolLog = exports.getPatrolLog = exports.getPatrolLogs = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// 순찰일지 목록 조회
const getPatrolLogs = async (req, res) => {
    try {
        const { siteId, inspectorId, startDate, endDate, page = '1', limit = '20' } = req.query;
        const where = {};
        // 사업소 관리자는 자기 사업소만 조회
        if (req.user.role === 'SITE_MANAGER' && req.user.siteId) {
            where.siteId = req.user.siteId;
        }
        else if (siteId) {
            where.siteId = siteId;
        }
        // 관리감독자는 자기 것만 조회
        if (req.user.role === 'SUPERVISOR') {
            where.inspectorId = req.user.id;
        }
        else if (inspectorId) {
            where.inspectorId = inspectorId;
        }
        if (startDate || endDate) {
            where.inspectionDate = {};
            if (startDate)
                where.inspectionDate.gte = new Date(startDate);
            if (endDate)
                where.inspectionDate.lte = new Date(endDate);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            prisma_1.default.patrolLog.findMany({
                where,
                include: {
                    inspector: {
                        select: { id: true, name: true, email: true }
                    },
                    site: {
                        select: { id: true, name: true, code: true }
                    },
                    items: {
                        include: {
                            photos: true
                        }
                    }
                },
                orderBy: { inspectionDate: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma_1.default.patrolLog.count({ where })
        ]);
        res.json({
            data: logs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Get patrol logs error:', error);
        res.status(500).json({ error: '순찰일지 목록 조회 중 오류가 발생했습니다.' });
    }
};
exports.getPatrolLogs = getPatrolLogs;
// 순찰일지 상세 조회
const getPatrolLog = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await prisma_1.default.patrolLog.findUnique({
            where: { id },
            include: {
                inspector: {
                    select: { id: true, name: true, email: true }
                },
                site: {
                    select: { id: true, name: true, code: true }
                },
                items: {
                    include: {
                        photos: true
                    },
                    orderBy: [
                        { category: 'asc' },
                        { itemNumber: 'asc' }
                    ]
                }
            }
        });
        if (!log) {
            return res.status(404).json({ error: '순찰일지를 찾을 수 없습니다.' });
        }
        res.json(log);
    }
    catch (error) {
        console.error('Get patrol log error:', error);
        res.status(500).json({ error: '순찰일지 조회 중 오류가 발생했습니다.' });
    }
};
exports.getPatrolLog = getPatrolLog;
// 순찰일지 생성
const createPatrolLog = async (req, res) => {
    try {
        const { siteId, inspectionDate, department, location, items, notes } = req.body;
        const inspectorId = req.user.id;
        const log = await prisma_1.default.patrolLog.create({
            data: {
                inspectorId,
                siteId,
                inspectionDate: new Date(inspectionDate),
                department,
                location,
                notes,
                items: {
                    create: items.map((item) => ({
                        category: item.category,
                        itemNumber: item.itemNumber,
                        itemText: item.itemText,
                        status: item.status,
                        notes: item.notes
                    }))
                }
            },
            include: {
                inspector: {
                    select: { id: true, name: true, email: true }
                },
                site: {
                    select: { id: true, name: true, code: true }
                },
                items: true
            }
        });
        res.status(201).json(log);
    }
    catch (error) {
        console.error('Create patrol log error:', error);
        res.status(500).json({ error: '순찰일지 생성 중 오류가 발생했습니다.' });
    }
};
exports.createPatrolLog = createPatrolLog;
// 순찰일지 수정
const updatePatrolLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { inspectionDate, department, location, items, notes } = req.body;
        // 기존 순찰일지 조회
        const existingLog = await prisma_1.default.patrolLog.findUnique({
            where: { id }
        });
        if (!existingLog) {
            return res.status(404).json({ error: '순찰일지를 찾을 수 없습니다.' });
        }
        // 권한 확인
        if (req.user.role === 'SUPERVISOR' && existingLog.inspectorId !== req.user.id) {
            return res.status(403).json({ error: '수정 권한이 없습니다.' });
        }
        // 기존 항목 삭제 후 새로 생성
        await prisma_1.default.patrolItem.deleteMany({
            where: { patrolLogId: id }
        });
        const log = await prisma_1.default.patrolLog.update({
            where: { id },
            data: {
                inspectionDate: new Date(inspectionDate),
                department,
                location,
                notes,
                items: {
                    create: items.map((item) => ({
                        category: item.category,
                        itemNumber: item.itemNumber,
                        itemText: item.itemText,
                        status: item.status,
                        notes: item.notes
                    }))
                }
            },
            include: {
                inspector: {
                    select: { id: true, name: true, email: true }
                },
                site: {
                    select: { id: true, name: true, code: true }
                },
                items: {
                    include: {
                        photos: true
                    }
                }
            }
        });
        res.json(log);
    }
    catch (error) {
        console.error('Update patrol log error:', error);
        res.status(500).json({ error: '순찰일지 수정 중 오류가 발생했습니다.' });
    }
};
exports.updatePatrolLog = updatePatrolLog;
// 순찰일지 삭제
const deletePatrolLog = async (req, res) => {
    try {
        const { id } = req.params;
        const existingLog = await prisma_1.default.patrolLog.findUnique({
            where: { id }
        });
        if (!existingLog) {
            return res.status(404).json({ error: '순찰일지를 찾을 수 없습니다.' });
        }
        // 권한 확인
        if (req.user.role === 'SUPERVISOR' && existingLog.inspectorId !== req.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }
        await prisma_1.default.patrolLog.delete({
            where: { id }
        });
        res.json({ message: '순찰일지가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete patrol log error:', error);
        res.status(500).json({ error: '순찰일지 삭제 중 오류가 발생했습니다.' });
    }
};
exports.deletePatrolLog = deletePatrolLog;
// 순찰 항목별 사진 업로드
const uploadPatrolItemPhoto = async (req, res) => {
    try {
        const { itemId } = req.params;
        // TODO: 파일 업로드 로직 (multer + S3)
        res.json({ message: '사진이 업로드되었습니다.' });
    }
    catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ error: '사진 업로드 중 오류가 발생했습니다.' });
    }
};
exports.uploadPatrolItemPhoto = uploadPatrolItemPhoto;
//# sourceMappingURL=patrol.controller.js.map