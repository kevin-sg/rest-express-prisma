import jwt, { type JwtPayload } from 'jsonwebtoken';

import { HttpException } from '@/models';
import { HttpStatusCode } from './http-status.util';

const SECRET_KEY = process.env.JWT_PRIVATE_KEY || 'secret';
const EXPIRES_IN = process.env.JWT_TIME_EXPIRATION || '30d';

export const verifyJwt = (token: string): Promise<JwtPayload> => {
	return new Promise<JwtPayload>((res, rej): void => {
		return jwt.verify(token, SECRET_KEY, (err, decoded) => {
			if (err) {
				rej(new HttpException(err.message, HttpStatusCode.UNAUTHORIZED));
			}
			res(decoded as JwtPayload);
		});
	});
};

export const encryptJwt = <T>(payload: JwtPayload): Promise<string | T> => {
	return new Promise<string | T>((res, rej): void => {
		return jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, { expiresIn: EXPIRES_IN }, (err, encoded) => {
			if (err) {
				rej(new HttpException(err.message, HttpStatusCode.UNAUTHORIZED));
			}
			res(encoded);
		});
	});
};
