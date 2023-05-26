import { Router } from 'express';

export * from './constant';
import a from './auth.router';
import p from './post.router';
import s from './seed.router';
import u from './user.router';

const allRouters = Router();

allRouters.use(a).use(u).use(p).use(s);

export const routers = Router().use(allRouters);
