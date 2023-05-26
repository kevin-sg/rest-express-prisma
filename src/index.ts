import * as dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import morgan from 'morgan';

import { routers } from './routers';
import { logger, errorHandler } from './utils';

(() => {
	const app = express();

	// * middleware
	app.use(cors());
	app.use(morgan('dev'));
	app.use(cookieParser(process.env.COOKIE_PRIVATE_KEY));
	app.use(express.json());

	// * routers
	app.use(process.env.GLOBAL_PREFIX, routers);
	app.use(process.env.GLOBAL_PREFIX, (req: Request, res: Response) => {
		const URL = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}`;

		const endpoint = {
			auth: `${URL}/auth`,
			user: `${URL}/user`,
			post: `${URL}/post`,
		};

		res.json(endpoint);
	});
	app.use('/', (req: Request, res: Response) => {
		res.json({ status: 'API is running on /api' });
	});

	// * exception handler
	app.use(errorHandler);

	const PORT = +process.env.PORT! || 3000;
	app.listen(PORT, () => {
		logger.info(`The connection URL is: http://localhost:${PORT}`);
	});
})();
