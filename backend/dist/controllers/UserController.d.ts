import { Request, Response } from 'express';
declare class UserController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    index(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    destroy(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: UserController;
export default _default;
