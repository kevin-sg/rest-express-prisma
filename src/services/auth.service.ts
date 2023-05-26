import bc from 'bcrypt';

import { HttpStatusCode, encryptJwt } from '@/utils';
import { HttpException, type UserModel } from '@/models';
import prismaRepository, { type User } from '~prisma/prisma-client';

export class AuthService {
	public static _instance: AuthService;

	private constructor() {}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async login(email: string, password: string): Promise<User> {
		try {
			const hasUser = await prismaRepository.user.findUnique({ where: { email: email?.toLowerCase() } });
			if (!hasUser) {
				await prismaRepository.$disconnect();
				throw new HttpException('please enter another email address', HttpStatusCode.BAD_REQUEST);
			}

			const isValidPass = await bc.compare(password?.trim(), hasUser.password);
			if (!isValidPass) {
				await prismaRepository.$disconnect();
				throw new HttpException('the password is incorrect', HttpStatusCode.BAD_REQUEST);
			}

			const token = await encryptJwt<string>({ id: hasUser.id, email: hasUser.email });

			return { ...hasUser, token };
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}

	public async logout(id: number): Promise<UserModel> {
		try {
			const hasUser = await prismaRepository.user.findUnique({
				where: { id: Number(id) },
			});
			if (!hasUser) {
				prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[401], HttpStatusCode.UNAUTHORIZED);
			}

			return hasUser;
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}

	public async revalidate(id: number): Promise<UserModel | null> {
		try {
			const hasUser = await prismaRepository.user.findUnique({
				where: { id: Number(id) },
				select: { id: true, name: true, email: true },
			});
			if (!hasUser) {
				throw new HttpException(HttpStatusCode[401], HttpStatusCode.UNAUTHORIZED);
			}

			const token = await encryptJwt<string>({ id: hasUser.id, email: hasUser.email });

			return { ...hasUser, token };
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}
}
