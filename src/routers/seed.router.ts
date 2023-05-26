import { Router } from 'express';

import { SeedPath } from './constant';
import { SeedController } from '@/controllers';

const seedRouter = Router();

seedRouter.get(SeedPath.Base, SeedController.instance.executeSeed);

export default seedRouter;
