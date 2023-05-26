import { Router } from 'express';

import { PostPath } from './constant';
import { PostController } from '@/controllers';
import { CreatePostDto, UpdatePostDto } from '@/dto';
import { dtoValidationMiddleware, authenticateMiddleware } from '@/middleware';

const postRouter = Router();

postRouter.get(PostPath.Base, authenticateMiddleware, PostController.instance.findAll);
postRouter.get(PostPath.ById, authenticateMiddleware, PostController.instance.findOne);
postRouter.post(
	PostPath.Base,
	[authenticateMiddleware, dtoValidationMiddleware(CreatePostDto)],
	PostController.instance.create,
);
postRouter.put(
	PostPath.ById,
	[authenticateMiddleware, dtoValidationMiddleware(UpdatePostDto)],
	PostController.instance.update,
);
postRouter.delete(PostPath.ById, authenticateMiddleware, PostController.instance.remove);

export default postRouter;
