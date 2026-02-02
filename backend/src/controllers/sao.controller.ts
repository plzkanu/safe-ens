import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

// SAO 보고서 목록 조회
export const getSAOReports = async (req: AuthRequest, res: Response) => {
  try {
    const { siteId, inspectorId, startDate, endDate, page = '1', limit = '20' } = req.query;
    
    const where: any = {};
    
    // 사업소 관리자는 자기 사업소만 조회
    if (req.user!.role === 'SITE_MANAGER' && req.user!.siteId) {
      where.siteId = req.user!.siteId;
    } else if (siteId) {
      where.siteId = siteId as string;
    }
    
    // 관리감독자는 자기 것만 조회
    if (req.user!.role === 'SUPERVISOR') {
      where.inspectorId = req.user!.id;
    } else if (inspectorId) {
      where.inspectorId = inspectorId as string;
    }
    
    if (startDate || endDate) {
      where.reportDate = {};
      if (startDate) where.reportDate.gte = new Date(startDate as string);
      if (endDate) where.reportDate.lte = new Date(endDate as string);
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const [reports, total] = await Promise.all([
      prisma.sAOReport.findMany({
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
        take: parseInt(limit as string)
      }),
      prisma.sAOReport.count({ where })
    ]);

    res.json({
      data: reports,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get SAO reports error:', error);
    res.status(500).json({ error: 'SAO 보고서 목록 조회 중 오류가 발생했습니다.' });
  }
};

// SAO 보고서 상세 조회
export const getSAOReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await prisma.sAOReport.findUnique({
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
  } catch (error) {
    console.error('Get SAO report error:', error);
    res.status(500).json({ error: 'SAO 보고서 조회 중 오류가 발생했습니다.' });
  }
};

// SAO 보고서 생성
export const createSAOReport = async (req: AuthRequest, res: Response) => {
  try {
    const {
      siteId,
      reportDate,
      reportTime,
      workplace,
      workArea,
      workType,
      workShift,
      observerCount,
      workerCount,
      workResponse,
      items
    } = req.body;
    
    const inspectorId = req.user!.id;

    const report = await prisma.sAOReport.create({
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
          create: items.map((item: any) => ({
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
  } catch (error) {
    console.error('Create SAO report error:', error);
    res.status(500).json({ error: 'SAO 보고서 생성 중 오류가 발생했습니다.' });
  }
};

// SAO 보고서 수정
export const updateSAOReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      reportDate,
      reportTime,
      workplace,
      workArea,
      workType,
      workShift,
      observerCount,
      workerCount,
      workResponse,
      items
    } = req.body;

    // 기존 보고서 조회
    const existingReport = await prisma.sAOReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      return res.status(404).json({ error: 'SAO 보고서를 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (req.user!.role === 'SUPERVISOR' && existingReport.inspectorId !== req.user!.id) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    // 기존 항목 삭제 후 새로 생성
    await prisma.sAOItem.deleteMany({
      where: { saoReportId: id }
    });

    const report = await prisma.sAOReport.update({
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
          create: items.map((item: any) => ({
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
  } catch (error) {
    console.error('Update SAO report error:', error);
    res.status(500).json({ error: 'SAO 보고서 수정 중 오류가 발생했습니다.' });
  }
};

// SAO 보고서 삭제
export const deleteSAOReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingReport = await prisma.sAOReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      return res.status(404).json({ error: 'SAO 보고서를 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (req.user!.role === 'SUPERVISOR' && existingReport.inspectorId !== req.user!.id) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await prisma.sAOReport.delete({
      where: { id }
    });

    res.json({ message: 'SAO 보고서가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete SAO report error:', error);
    res.status(500).json({ error: 'SAO 보고서 삭제 중 오류가 발생했습니다.' });
  }
};
