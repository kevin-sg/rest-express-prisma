import { validate } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { HttpStatusCode, logger } from '@/utils';

import type { RequestHandler } from 'express';

export const dtoValidationMiddleware = (dtoClass: ClassConstructor<object>): RequestHandler => {
	return function (req, res, next) {
		const dtoObject = plainToInstance(dtoClass, req.body);
		logger.warn(dtoObject);

		validate(dtoObject).then((errs) => {
			if (errs.length) {
				const validationErrors = errs.map((error) => Object.values(error.constraints)).flat();
				res
					.status(400)
					.json({ statusCode: res.statusCode, message: validationErrors, error: HttpStatusCode[res.statusCode] });
			} else {
				sanitize(dtoObject);
				req.body = dtoObject;
				next();
			}
		});
	};
};
