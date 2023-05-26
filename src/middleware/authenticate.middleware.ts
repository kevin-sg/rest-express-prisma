import { cookieConfig, verifyJwt } from '@/utils';

import type { Request, Response, NextFunction } from 'express';

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const cookieToken: string = req.cookies[process.env.COOKIE_NAME] || '';

	try {
		const user = await verifyJwt(cookieToken);
		if (user) {
			req.user = { id: user.id, email: user.email };
		}

		next();
	} catch (err) {
		res.clearCookie(process.env.COOKIE_NAME, cookieConfig);
		next(err);
	}
};
