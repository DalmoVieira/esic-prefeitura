import { Request, Response } from 'express';
declare class DepartmentController {
    index(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    store(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: DepartmentController;
export default _default;
