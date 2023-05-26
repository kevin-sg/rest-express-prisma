import bc from 'bcrypt';

import { HttpStatusCode, encryptJwt } from '@/utils';
import { HttpException, type UserModel } from '@/models';
import prismaRepository, { type User } from '~prisma/prisma-client';

export class UserService {
	public static _instance: UserService;

	private constructor() {}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async createUser(userData: UserModel): Promise<UserModel> {
		try {
			const hasUser = await prismaRepository.user.findUnique({ where: { email: userData.email.toLowerCase() } });
			if (hasUser) {
				await prismaRepository.$disconnect();
				throw new HttpException('please enter another email address', HttpStatusCode.BAD_REQUEST);
			}

			const hashPss = await bc.hash(userData.password, bc.genSaltSync(10));

			const newUser = await prismaRepository.user.create({
				data: { ...userData, password: hashPss },
				select: { id: true, name: true, lastName: true, email: true },
			});
			await prismaRepository.$disconnect();

			const token = await encryptJwt<string>({ id: newUser.id, email: newUser.email });

			return { ...newUser, token };
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}

	public async getAllUsers(): Promise<UserModel[]> {
		try {
			const users = await prismaRepository.user.findMany({
				where: { isActive: true },
				select: { id: true, name: true, email: true, lastName: true },
			});
			if (!users.length) {
				prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}
			return users;
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}

	public async getUserById(id: number): Promise<UserModel | null> {
		try {
			const user = await prismaRepository.user.findUnique({
				where: { id: Number(id) },
				select: {
					id: true,
					name: true,
					lastName: true,
					email: true,
					password: true,
					posts: { select: { id: true, title: true, content: true, published: true } },
				},
			});
			if (!user) {
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}

			return user;
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}

	public async updateUser(id: number, userData: UserModel): Promise<UserModel> {
		try {
			const hasUser = await this.getUserById(id);

			const isValidPass = await bc.compare(userData.password!.trim(), hasUser.password!);
			if (!isValidPass) {
				await prismaRepository.$disconnect();
				throw new HttpException('the password is incorrect', HttpStatusCode.UNAUTHORIZED);
			}

			const hashPass = await bc.hash(userData.password, bc.genSaltSync(10));

			const updateUser = await prismaRepository.user.update({
				where: { id: Number(id) },
				select: { id: true, name: true, lastName: true, email: true, token: true },
				data: { ...userData, password: hashPass },
			});
			if (!updateUser) {
				await prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}

			const token = await encryptJwt<string>({ id: updateUser.id, email: updateUser.email });

			return { ...updateUser, token };
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}

	public async removeUser(id: number): Promise<User> {
		try {
			const hasUser = await this.getUserById(id);
			if (!hasUser.isActive) {
				throw new HttpException('the user is disabled', HttpStatusCode.BAD_REQUEST);
			}

			return await prismaRepository.user.update({ where: { id: Number(id) }, data: { isActive: false } });
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}
}
