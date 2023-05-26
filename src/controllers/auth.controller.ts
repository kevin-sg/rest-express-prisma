import { cookieConfig } from '@/utils';
import { AuthService } from '@/services';

import type { Request, Response, NextFunction } from 'express';

export class AuthController {
	private static _instance: AuthController;

	private constructor() {}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email = '', password = '@' } = req.body;

			const newSession = await AuthService.instance.login(email, password);
			res.status(201).cookie(process.env.COOKIE_NAME, newSession.token, cookieConfig).json(newSession);
		} catch (err) {
			next(err);
		}
	}

	public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await AuthService.instance.logout(Number(req.user?.id));
			res
				.status(200)
				.clearCookie(process.env.COOKIE_NAME)
				.json({ code: 'session successfully closed', status: res.statusCode });
		} catch (err) {
			next(err);
		}
	}

	public async revalidateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const newSession = await AuthService.instance.revalidate(Number(req.user?.id));
			res.status(200).cookie(process.env.COOKIE_NAME, newSession.token).json(newSession);
		} catch (err) {
			next(err);
		}
	}
}
