"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonCompliantUsers = exports.getMonthlyTrend = exports.getComplianceRate = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// 전체 대시보드 통계
const getDashboardStats = async (req, res) => {
    try {
        const { siteId, startDate, endDate } = req.query;
        const where = {};
        if (req.user.role === 'SITE_MANAGER' && req.user.siteId) {
            where.siteId = req.user.siteId;
        }
        else if (siteId) {
            where.siteId = siteId;
        }
        if (startDate || endDate) {
            where.inspectionDate = {};
            if (startDate)
                where.inspectionDate.gte = new Date(startDate);
            if (endDate)
                where.inspectionDate.lte = new Date(endDate);
        }
        // 순찰일지 통계
        const patrolStats = await prisma_1.default.patrolLog.findMany({
            where,
            include: {
                items: true,
                inspector: {
                    select: { id: true, name: true }
                }
            }
        });
        // SAO 통계
        const saoWhere = { ...where };
        if (where.inspectionDate) {
            saoWhere.reportDate = where.inspectionDate;
            delete saoWhere.inspectionDate;
        }
        const saoStats = await prisma_1.default.sAOReport.findMany({
            where: saoWhere,
            include: {
                items: true,
                inspector: {
                    select: { id: true, name: true }
                }
            }
        });
        // 통계 계산
        const totalPatrols = patrolStats.length;
        const totalSAOs = saoStats.length;
        // 부적합 건수
        const badItemsCount = patrolStats.reduce((sum, log) => {
            return sum + log.items.filter(item => item.status === 'BAD').length;
        }, 0);
        // 관리감독자별 작성 통계
        const inspectorStats = new Map();
        patrolStats.forEach(log => {
            const key = log.inspector.id;
            if (!inspectorStats.has(key)) {
                inspectorStats.set(key, {
                    id: log.inspector.id,
                    name: log.inspector.name,
                    patrolCount: 0,
                    badItemsCount: 0
                });
            }
            const stat = inspectorStats.get(key);
            stat.patrolCount++;
            stat.badItemsCount += log.items.filter(item => item.status === 'BAD').length;
        });
        // 카테고리별 부적합 통계
        const categoryStats = new Map();
        patrolStats.forEach(log => {
            log.items.filter(item => item.status === 'BAD').forEach(item => {
                if (!categoryStats.has(item.category)) {
                    categoryStats.set(item.category, 0);
                }
                categoryStats.set(item.category, categoryStats.get(item.category) + 1);
            });
        });
        res.json({
            summary: {
                totalPatrols,
                totalSAOs,
                badItemsCount,
                goodItemsCount: patrolStats.reduce((sum, log) => {
                    return sum + log.items.filter(item => item.status === 'GOOD').length;
                }, 0)
            },
            inspectorStats: Array.from(inspectorStats.values()).sort((a, b) => b.patrolCount - a.patrolCount),
            categoryStats: Array.from(categoryStats.entries())
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count),
            recentPatrols: patrolStats.slice(0, 10),
            recentSAOs: saoStats.slice(0, 10)
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: '통계 조회 중 오류가 발생했습니다.' });
    }
};
exports.getDashboardStats = getDashboardStats;
// 사업장별 순찰 실시율
const getComplianceRate = async (req, res) => {
    try {
        const { siteId, startDate, endDate } = req.query;
        // 관리감독자 목록
        const supervisors = await prisma_1.default.user.findMany({
            where: {
                role: 'SUPERVISOR',
                ...(siteId && { siteId: siteId })
            },
            select: {
                id: true,
                name: true,
                siteId: true
            }
        });
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        // 각 관리감독자의 순찰 이행 여부
        const complianceData = await Promise.all(supervisors.map(async (supervisor) => {
            const patrolCount = await prisma_1.default.patrolLog.count({
                where: {
                    inspectorId: supervisor.id,
                    inspectionDate: {
                        gte: start,
                        lte: end
                    }
                }
            });
            // 주 단위 계산
            const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
            const expectedCount = weeks; // 주 1회 기대
            const complianceRate = expectedCount > 0 ? (patrolCount / expectedCount) * 100 : 0;
            return {
                supervisor,
                patrolCount,
                expectedCount,
                complianceRate: Math.min(complianceRate, 100),
                isCompliant: patrolCount >= expectedCount
            };
        }));
        res.json({
            period: { start, end },
            data: complianceData.sort((a, b) => b.complianceRate - a.complianceRate)
        });
    }
    catch (error) {
        console.error('Get compliance rate error:', error);
        res.status(500).json({ error: '순찰 실시율 조회 중 오류가 발생했습니다.' });
    }
};
exports.getComplianceRate = getComplianceRate;
// 월별 추이
const getMonthlyTrend = async (req, res) => {
    try {
        const { siteId, months = '6' } = req.query;
        const monthsCount = parseInt(months);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsCount);
        const where = {};
        if (siteId)
            where.siteId = siteId;
        // 월별 순찰일지 통계
        const patrols = await prisma_1.default.patrolLog.findMany({
            where: {
                ...where,
                inspectionDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                items: true
            }
        });
        // 월별 그룹화
        const monthlyData = new Map();
        patrols.forEach(patrol => {
            const month = patrol.inspectionDate.toISOString().substring(0, 7); // YYYY-MM
            if (!monthlyData.has(month)) {
                monthlyData.set(month, {
                    month,
                    patrolCount: 0,
                    goodCount: 0,
                    badCount: 0
                });
            }
            const data = monthlyData.get(month);
            data.patrolCount++;
            patrol.items.forEach(item => {
                if (item.status === 'GOOD')
                    data.goodCount++;
                if (item.status === 'BAD')
                    data.badCount++;
            });
        });
        res.json({
            data: Array.from(monthlyData.values()).sort((a, b) => a.month.localeCompare(b.month))
        });
    }
    catch (error) {
        console.error('Get monthly trend error:', error);
        res.status(500).json({ error: '월별 추이 조회 중 오류가 발생했습니다.' });
    }
};
exports.getMonthlyTrend = getMonthlyTrend;
// 미작성자 리스트
const getNonCompliantUsers = async (req, res) => {
    try {
        const { siteId } = req.query;
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const supervisors = await prisma_1.default.user.findMany({
            where: {
                role: 'SUPERVISOR',
                ...(siteId && { siteId: siteId })
            },
            include: {
                site: {
                    select: { name: true }
                }
            }
        });
        const nonCompliantUsers = await Promise.all(supervisors.map(async (supervisor) => {
            const patrolCount = await prisma_1.default.patrolLog.count({
                where: {
                    inspectorId: supervisor.id,
                    inspectionDate: {
                        gte: startOfWeek
                    }
                }
            });
            return {
                user: {
                    id: supervisor.id,
                    name: supervisor.name,
                    email: supervisor.email,
                    site: supervisor.site
                },
                hasPatrolThisWeek: patrolCount > 0,
                patrolCount
            };
        }));
        res.json({
            period: { start: startOfWeek },
            nonCompliantUsers: nonCompliantUsers.filter(u => !u.hasPatrolThisWeek)
        });
    }
    catch (error) {
        console.error('Get non-compliant users error:', error);
        res.status(500).json({ error: '미작성자 조회 중 오류가 발생했습니다.' });
    }
};
exports.getNonCompliantUsers = getNonCompliantUsers;
//# sourceMappingURL=stats.controller.js.map