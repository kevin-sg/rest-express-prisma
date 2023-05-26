import type { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
	abstract create(req: Request, res: Response, next: NextFunction): Promise<void>;

	abstract findAll(req: Request, res: Response, next: NextFunction): Promise<void>;

	abstract findOne(req: Request, res: Response, next: NextFunction): Promise<void>;

	abstract update(req: Request, res: Response, next: NextFunction): Promise<void>;

	abstract remove(req: Request, res: Response, next: NextFunction): Promise<void>;
}
