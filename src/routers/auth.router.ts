import { Router } from 'express';

import { AuthPath } from './constant';
import { LoginUserDto } from '@/dto';
import { AuthController } from '@/controllers';
import { dtoValidationMiddleware, authenticateMiddleware } from '@/middleware';

const authRouter = Router();

authRouter.post(AuthPath.Login, dtoValidationMiddleware(LoginUserDto), AuthController.instance.login);
authRouter.get(AuthPath.Logout, authenticateMiddleware, AuthController.instance.logout);
authRouter.get(AuthPath.Revalidate, authenticateMiddleware, AuthController.instance.revalidateSession);

export default Router().use(authRouter);
