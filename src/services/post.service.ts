import { HttpStatusCode } from '@/utils';
import { HttpException, type PostModel } from '@/models';
import prismaRepository, { type Post } from '~prisma/prisma-client';

export class PostService {
	public static _instance: PostService;

	private constructor() {}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async createPost(userId: number, postData: PostModel): Promise<Post> {
		try {
			const hasPost = await prismaRepository.post.findMany({ where: { title: postData.title.toLowerCase() } });
			if (hasPost?.length) {
				await prismaRepository.$disconnect();
				throw new HttpException('please enter another name for the title', HttpStatusCode.BAD_REQUEST);
			}

			const payload = {
				title: postData.title.toLowerCase(),
				content: postData.content?.toLowerCase() || '',
				published: true,
				userId: Number(userId),
			};

			return await prismaRepository.post.create({ data: payload });
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}

	public async getAllPosts(): Promise<Post[]> {
		try {
			const posts = await prismaRepository.post.findMany({ where: { published: true } });
			if (!posts.length) {
				prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}

			return posts;
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}

	public async getPostById(id: number): Promise<Post | null> {
		try {
			const hasPost = await prismaRepository.post.findUnique({
				where: { id: Number(id) },
				include: { user: { select: { id: true, email: true } } },
			});
			if (!hasPost) {
				prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}

			return hasPost;
		} catch (err) {
			prismaRepository.$disconnect();
			throw err;
		}
	}

	public async updatePost(userId: number, postId: number, postData: PostModel): Promise<Post> {
		try {
			const hasPost = await this.getPostById(Number(postId));
			if (hasPost.userId !== Number(userId)) {
				await prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[401], HttpStatusCode.UNAUTHORIZED);
			}

			const payload = {
				title: postData.title?.toLowerCase() || hasPost.title,
				content: postData.content?.toLowerCase() || hasPost.content,
			};

			const updatePost = await prismaRepository.post.update({ where: { id: Number(postId) }, data: { ...payload } });
			if (!updatePost) {
				await prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[422], HttpStatusCode.UNPROCESSABLE_ENTITY);
			}

			return updatePost;
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}

	public async removePost(userId: number, postId: number): Promise<Post> {
		try {
			const hasPost = await this.getPostById(postId);

			if (hasPost.userId !== Number(userId)) {
				await prismaRepository.$disconnect();
				throw new HttpException(HttpStatusCode[401], HttpStatusCode.UNAUTHORIZED);
			}

			return await prismaRepository.post.delete({ where: { id: Number(postId) } });
		} catch (err) {
			await prismaRepository.$disconnect();
			throw err;
		}
	}
}
