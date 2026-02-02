import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getDashboardStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getComplianceRate: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getMonthlyTrend: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getNonCompliantUsers: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=stats.controller.d.ts.map