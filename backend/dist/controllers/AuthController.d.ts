import { Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthController;
export default _default;
