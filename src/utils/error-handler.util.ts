import { logger } from './logger.util';
import { HttpException } from '@/models';
import { HttpStatusCode } from './http-status.util';

import type { Request, Response, NextFunction } from 'express';

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
	logger.error(err.message);

	if (err instanceof HttpException) {
		return res
			.status(err.httpCode)
			.json({ code: err.message ? err.message : HttpStatusCode[res.statusCode], status: err.httpCode });
	} else {
		// For unhandled errors.
		res.status(500).json({ code: HttpStatusCode[res.statusCode], status: HttpStatusCode.INTERNAL_SERVER_ERROR });
		next();
	}
};
