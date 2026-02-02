import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

// 순찰일지 목록 조회
export const getPatrolLogs = async (req: AuthRequest, res: Response) => {
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
      where.inspectionDate = {};
      if (startDate) where.inspectionDate.gte = new Date(startDate as string);
      if (endDate) where.inspectionDate.lte = new Date(endDate as string);
    }
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const [logs, total] = await Promise.all([
      prisma.patrolLog.findMany({
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
        take: parseInt(limit as string)
      }),
      prisma.patrolLog.count({ where })
    ]);

    res.json({
      data: logs,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get patrol logs error:', error);
    res.status(500).json({ error: '순찰일지 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 순찰일지 상세 조회
export const getPatrolLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const log = await prisma.patrolLog.findUnique({
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
  } catch (error) {
    console.error('Get patrol log error:', error);
    res.status(500).json({ error: '순찰일지 조회 중 오류가 발생했습니다.' });
  }
};

// 순찰일지 생성
export const createPatrolLog = async (req: AuthRequest, res: Response) => {
  try {
    const { siteId, inspectionDate, department, location, items, notes } = req.body;
    const inspectorId = req.user!.id;

    const log = await prisma.patrolLog.create({
      data: {
        inspectorId,
        siteId,
        inspectionDate: new Date(inspectionDate),
        department,
        location,
        notes,
        items: {
          create: items.map((item: any) => ({
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
  } catch (error) {
    console.error('Create patrol log error:', error);
    res.status(500).json({ error: '순찰일지 생성 중 오류가 발생했습니다.' });
  }
};

// 순찰일지 수정
export const updatePatrolLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { inspectionDate, department, location, items, notes } = req.body;

    // 기존 순찰일지 조회
    const existingLog = await prisma.patrolLog.findUnique({
      where: { id }
    });

    if (!existingLog) {
      return res.status(404).json({ error: '순찰일지를 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (req.user!.role === 'SUPERVISOR' && existingLog.inspectorId !== req.user!.id) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    // 기존 항목 삭제 후 새로 생성
    await prisma.patrolItem.deleteMany({
      where: { patrolLogId: id }
    });

    const log = await prisma.patrolLog.update({
      where: { id },
      data: {
        inspectionDate: new Date(inspectionDate),
        department,
        location,
        notes,
        items: {
          create: items.map((item: any) => ({
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
  } catch (error) {
    console.error('Update patrol log error:', error);
    res.status(500).json({ error: '순찰일지 수정 중 오류가 발생했습니다.' });
  }
};

// 순찰일지 삭제
export const deletePatrolLog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingLog = await prisma.patrolLog.findUnique({
      where: { id }
    });

    if (!existingLog) {
      return res.status(404).json({ error: '순찰일지를 찾을 수 없습니다.' });
    }

    // 권한 확인
    if (req.user!.role === 'SUPERVISOR' && existingLog.inspectorId !== req.user!.id) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await prisma.patrolLog.delete({
      where: { id }
    });

    res.json({ message: '순찰일지가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete patrol log error:', error);
    res.status(500).json({ error: '순찰일지 삭제 중 오류가 발생했습니다.' });
  }
};

// 순찰 항목별 사진 업로드
export const uploadPatrolItemPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    // TODO: 파일 업로드 로직 (multer + S3)
    
    res.json({ message: '사진이 업로드되었습니다.' });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: '사진 업로드 중 오류가 발생했습니다.' });
  }
};
