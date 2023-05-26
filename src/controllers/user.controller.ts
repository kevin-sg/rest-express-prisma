import { BaseController } from './abs.controller';

import { cookieConfig } from '@/utils';
import { UserService } from '@/services';

import type { Request, Response, NextFunction } from 'express';

export class UserController extends BaseController {
	private static _instance: UserController;

	private constructor() {
		super();
	}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email = '', name = '', lastName = '', password = '@' } = req.body;

			const newUser = await UserService.instance.createUser({ email, name, lastName, password });
			res.status(201).cookie(process.env.COOKIE_NAME, newUser.token, cookieConfig).json(newUser);
		} catch (err) {
			next(err);
		}
	}

	public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const users = await UserService.instance.getAllUsers();
			res.status(200).json(users);
		} catch (err) {
			next(err);
		}
	}

	public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await UserService.instance.getUserById(Number(req.params?.id));
			res.status(200).json(user);
		} catch (err) {
			next(err);
		}
	}

	public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const updatedUser = await UserService.instance.updateUser(Number(req.user.id), req.body);
			res.status(201).cookie(process.env.COOKIE_NAME, updatedUser.token, cookieConfig).json(updatedUser);
		} catch (err) {
			next(err);
		}
	}

	public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await UserService.instance.removeUser(Number(req.user?.id));
			res.status(200).json({ code: 'the user was successfully deleted', status: res.statusCode });
		} catch (err) {
			next(err);
		}
	}
}
