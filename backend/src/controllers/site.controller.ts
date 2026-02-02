import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

// 사업소 목록 조회
export const getSites = async (req: AuthRequest, res: Response) => {
  try {
    const sites = await prisma.site.findMany({
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
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({ error: '사업소 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 사업소 상세 조회
export const getSite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const site = await prisma.site.findUnique({
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
  } catch (error) {
    console.error('Get site error:', error);
    res.status(500).json({ error: '사업소 조회 중 오류가 발생했습니다.' });
  }
};

// 사업소 생성
export const createSite = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, address, description } = req.body;

    // 코드 중복 확인
    const existingSite = await prisma.site.findUnique({
      where: { code }
    });

    if (existingSite) {
      return res.status(400).json({ error: '이미 존재하는 사업소 코드입니다.' });
    }

    const site = await prisma.site.create({
      data: {
        name,
        code,
        address,
        description
      }
    });

    res.status(201).json(site);
  } catch (error) {
    console.error('Create site error:', error);
    res.status(500).json({ error: '사업소 생성 중 오류가 발생했습니다.' });
  }
};

// 사업소 수정
export const updateSite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, address, description } = req.body;

    const site = await prisma.site.update({
      where: { id },
      data: {
        name,
        code,
        address,
        description
      }
    });

    res.json(site);
  } catch (error) {
    console.error('Update site error:', error);
    res.status(500).json({ error: '사업소 수정 중 오류가 발생했습니다.' });
  }
};

// 사업소 삭제
export const deleteSite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 사업소에 속한 사용자가 있는지 확인
    const userCount = await prisma.user.count({
      where: { siteId: id }
    });

    if (userCount > 0) {
      return res.status(400).json({ 
        error: '사업소에 속한 사용자가 있어 삭제할 수 없습니다.' 
      });
    }

    await prisma.site.delete({
      where: { id }
    });

    res.json({ message: '사업소가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete site error:', error);
    res.status(500).json({ error: '사업소 삭제 중 오류가 발생했습니다.' });
  }
};
