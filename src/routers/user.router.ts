import { Router } from 'express';

import { UserPath } from './constant';
import { UserController } from '@/controllers';
import { CreateUserDto, UpdateUserDto } from '@/dto';
import { dtoValidationMiddleware, authenticateMiddleware } from '@/middleware';

const userRouter = Router();

userRouter.get(UserPath.Base, authenticateMiddleware, UserController.instance.findAll);
userRouter.get(UserPath.ById, authenticateMiddleware, UserController.instance.findOne);
userRouter.post(UserPath.Base, dtoValidationMiddleware(CreateUserDto), UserController.instance.create);
userRouter.put(
	UserPath.Base,
	[authenticateMiddleware, dtoValidationMiddleware(UpdateUserDto)],
	UserController.instance.update,
);
userRouter.delete(UserPath.Base, authenticateMiddleware, UserController.instance.remove);

export default userRouter;
