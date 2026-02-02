import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getSAOReports: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSAOReport: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSAOReport: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSAOReport: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSAOReport: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=sao.controller.d.ts.map