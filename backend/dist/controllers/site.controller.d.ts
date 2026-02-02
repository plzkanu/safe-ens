import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getSites: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSite: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSite: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSite: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteSite: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=site.controller.d.ts.map