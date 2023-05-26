import bc from 'bcrypt';

import { logger } from '@/utils';
import prisma from '~prisma/prisma-client';

export class SeedService {
	private static _instance: SeedService;

	private constructor() {}

	public static get instance(): SeedService {
		return this._instance || (this._instance = new this());
	}

	public async insertData(): Promise<void> {
		try {
			const deleteUsers = prisma.user.deleteMany();
			const deletePosts = prisma.post.deleteMany();
			// The transaction runs synchronously so deleteUsers must run last.
			await prisma.$transaction([deletePosts, deleteUsers]);

			const tom = await prisma.user.upsert({
				where: { email: 'tom@prisma.io' },
				update: {},
				create: {
					email: 'tom@prisma.io',
					name: 'Tom',
					lastName: 'Claus',
					password: bc.hashSync('@Demo123', bc.genSaltSync(10)),
					isActive: true,
					posts: {
						create: {
							title: 'Check out Prisma with Express.js',
							content: 'https://www.prisma.io/express',
							published: true,
						},
					},
				},
			});
			const bob = await prisma.user.upsert({
				where: { email: 'bob@express.com' },
				update: {},
				create: {
					email: 'bob@express.com',
					name: 'Bob',
					lastName: 'Otto',
					password: bc.hashSync('@Demo123', bc.genSaltSync(10)),
					isActive: true,
					posts: {
						create: [
							{
								title: 'Follow Prisma on Twitter',
								content: 'https://twitter.com/prisma',
								published: true,
							},
							{
								title: 'Follow Nexus on Twitter',
								content: 'https://twitter.com/nexusgql',
								published: true,
							},
						],
					},
				},
			});

			await prisma.$disconnect();
			logger.info('SEED EXECUTED!!');
		} catch (err: any) {
			logger.error(err.message);
			await prisma.$disconnect();
			process.exit(1);
		}
	}
}
