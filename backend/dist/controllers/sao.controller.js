"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSAOReport = exports.updateSAOReport = exports.createSAOReport = exports.getSAOReport = exports.getSAOReports = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// SAO 보고서 목록 조회
const getSAOReports = async (req, res) => {
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
            where.reportDate = {};
            if (startDate)
                where.reportDate.gte = new Date(startDate);
            if (endDate)
                where.reportDate.lte = new Date(endDate);
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [reports, total] = await Promise.all([
            prisma_1.default.sAOReport.findMany({
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
                orderBy: { reportDate: 'desc' },
                skip,
                take: parseInt(limit)
            }),
            prisma_1.default.sAOReport.count({ where })
        ]);
        res.json({
            data: reports,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Get SAO reports error:', error);
        res.status(500).json({ error: 'SAO 보고서 목록 조회 중 오류가 발생했습니다.' });
    }
};
exports.getSAOReports = getSAOReports;
// SAO 보고서 상세 조회
const getSAOReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma_1.default.sAOReport.findUnique({
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
        if (!report) {
            return res.status(404).json({ error: 'SAO 보고서를 찾을 수 없습니다.' });
        }
        res.json(report);
    }
    catch (error) {
        console.error('Get SAO report error:', error);
        res.status(500).json({ error: 'SAO 보고서 조회 중 오류가 발생했습니다.' });
    }
};
exports.getSAOReport = getSAOReport;
// SAO 보고서 생성
const createSAOReport = async (req, res) => {
    try {
        const { siteId, reportDate, reportTime, workplace, workArea, workType, workShift, observerCount, workerCount, workResponse, items } = req.body;
        const inspectorId = req.user.id;
        const report = await prisma_1.default.sAOReport.create({
            data: {
                inspectorId,
                siteId,
                reportDate: new Date(reportDate),
                reportTime,
                workplace,
                workArea,
                workType,
                workShift,
                observerCount: observerCount || 1,
                workerCount: workerCount || 0,
                workResponse,
                items: {
                    create: items.map((item) => ({
                        category: item.category,
                        itemNumber: item.itemNumber,
                        itemText: item.itemText,
                        checked: item.checked || false,
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
        res.status(201).json(report);
    }
    catch (error) {
        console.error('Create SAO report error:', error);
        res.status(500).json({ error: 'SAO 보고서 생성 중 오류가 발생했습니다.' });
    }
};
exports.createSAOReport = createSAOReport;
// SAO 보고서 수정
const updateSAOReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportDate, reportTime, workplace, workArea, workType, workShift, observerCount, workerCount, workResponse, items } = req.body;
        // 기존 보고서 조회
        const existingReport = await prisma_1.default.sAOReport.findUnique({
            where: { id }
        });
        if (!existingReport) {
            return res.status(404).json({ error: 'SAO 보고서를 찾을 수 없습니다.' });
        }
        // 권한 확인
        if (req.user.role === 'SUPERVISOR' && existingReport.inspectorId !== req.user.id) {
            return res.status(403).json({ error: '수정 권한이 없습니다.' });
        }
        // 기존 항목 삭제 후 새로 생성
        await prisma_1.default.sAOItem.deleteMany({
            where: { saoReportId: id }
        });
        const report = await prisma_1.default.sAOReport.update({
            where: { id },
            data: {
                reportDate: new Date(reportDate),
                reportTime,
                workplace,
                workArea,
                workType,
                workShift,
                observerCount,
                workerCount,
                workResponse,
                items: {
                    create: items.map((item) => ({
                        category: item.category,
                        itemNumber: item.itemNumber,
                        itemText: item.itemText,
                        checked: item.checked || false,
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
        res.json(report);
    }
    catch (error) {
        console.error('Update SAO report error:', error);
        res.status(500).json({ error: 'SAO 보고서 수정 중 오류가 발생했습니다.' });
    }
};
exports.updateSAOReport = updateSAOReport;
// SAO 보고서 삭제
const deleteSAOReport = async (req, res) => {
    try {
        const { id } = req.params;
        const existingReport = await prisma_1.default.sAOReport.findUnique({
            where: { id }
        });
        if (!existingReport) {
            return res.status(404).json({ error: 'SAO 보고서를 찾을 수 없습니다.' });
        }
        // 권한 확인
        if (req.user.role === 'SUPERVISOR' && existingReport.inspectorId !== req.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }
        await prisma_1.default.sAOReport.delete({
            where: { id }
        });
        res.json({ message: 'SAO 보고서가 삭제되었습니다.' });
    }
    catch (error) {
        console.error('Delete SAO report error:', error);
        res.status(500).json({ error: 'SAO 보고서 삭제 중 오류가 발생했습니다.' });
    }
};
exports.deleteSAOReport = deleteSAOReport;
//# sourceMappingURL=sao.controller.js.map