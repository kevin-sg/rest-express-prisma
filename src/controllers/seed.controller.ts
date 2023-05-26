import { SeedService } from '@/services';

import type { NextFunction, Request, Response } from 'express';

export class SeedController {
	private static _instance: SeedController;

	private constructor() {}

	public static get instance(): SeedController {
		return this._instance || (this._instance = new this());
	}

	public async executeSeed(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await SeedService.instance.insertData();
		} catch (err) {
			next(err);
		}
	}
}
