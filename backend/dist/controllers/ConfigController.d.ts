import { Request, Response } from 'express';
import multer from 'multer';
export declare const uploadBrasao: multer.Multer;
declare class ConfigController {
    show(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ConfigController;
export default _default;
