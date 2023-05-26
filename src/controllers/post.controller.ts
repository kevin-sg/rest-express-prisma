import { PostService } from '@/services';
import { BaseController } from './abs.controller';

import type { Request, Response, NextFunction } from 'express';

export class PostController extends BaseController {
	private static _instance: PostController;

	private constructor() {
		super();
	}

	public static get instance(): PostController {
		return this._instance || (this._instance = new this());
	}

	public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { user, body } = req;

		try {
			const newPost = await PostService.instance.createPost(Number(user?.id), body);
			res.status(201).json(newPost);
		} catch (err) {
			next(err);
		}
	}

	public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const posts = await PostService.instance.getAllPosts();
			res.status(200).json(posts);
		} catch (err) {
			console.error(err);
			next(err);
		}
	}

	public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const post = await PostService.instance.getPostById(Number(req.params?.id));
			res.status(200).json(post);
		} catch (err) {
			next(err);
		}
	}

	public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { user, params, body } = req;

		try {
			const updatedPost = await PostService.instance.updatePost(Number(user?.id), Number(params?.id), body);
			res.status(201).json(updatedPost);
		} catch (err) {
			next(err);
		}
	}

	public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { user, params } = req;

		try {
			await PostService.instance.removePost(Number(user?.id), Number(params?.id));
			res.status(200).json({ message: 'the post was successfully deleted' });
		} catch (err) {
			next(err);
		}
	}
}
