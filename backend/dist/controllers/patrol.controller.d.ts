import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getPatrolLogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPatrolLog: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPatrolLog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePatrolLog: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePatrolLog: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadPatrolItemPhoto: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=patrol.controller.d.ts.map