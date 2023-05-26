import type { JwtPayload } from 'jsonwebtoken';

declare module 'jsonwebtoken' {
	export interface JwtPayload {
		id?: number;
		email?: string;
	}
}

export {};
