import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

// 사용자 목록 조회
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { siteId, role, search } = req.query;
    
    const where: any = {};
    
    if (siteId) {
      where.siteId = siteId as string;
    }
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const users = await prisma.user.findMany({
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
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: '사용자 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 사용자 생성
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role, siteId } = req.body;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
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
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
  }
};

// 사용자 수정
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, role, siteId, password } = req.body;

    const data: any = { email, name, role };
    
    if (siteId !== undefined) {
      data.siteId = siteId || null;
    }
    
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
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
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: '사용자 수정 중 오류가 발생했습니다.' });
  }
};

// 사용자 삭제
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: '사용자 삭제 중 오류가 발생했습니다.' });
  }
};
