import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
declare class RequestController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    show(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    index(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    assign(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    respond(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadAttachment(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listAttachments(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    publicSearch(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: RequestController;
export default _default;
