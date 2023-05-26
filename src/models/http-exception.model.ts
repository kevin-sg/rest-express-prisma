import { HttpStatusCode } from '@/utils';

export class HttpException extends Error {
	public readonly message: string;
	public readonly httpCode: HttpStatusCode;

	constructor(message: string, httpCode: HttpStatusCode) {
		super(message);

		this.message = message;
		this.httpCode = httpCode;

		Error.captureStackTrace(this);
	}
}
