import type { Request, Express } from 'express-serve-static-core';

interface QParams {
	id?: string;
	email?: string;
}

interface PayloadResponse {
	code: string;
	status: number;
}

declare module 'express-serve-static-core' {
	export interface Request {
		params?: QParams | { [x: string]: string };
		body?: any;
		user?: { id?: number; email?: string };
	}

	export type Response<P = PayloadResponse> = Response<P>;
}

export {};
