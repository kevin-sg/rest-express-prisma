namespace NodeJS {
	interface ProcessEnv {
		PORT?: string;
		GLOBAL_PREFIX?: string;
		DATABASE_URL?: string;
		JWT_PRIVATE_KEY?: string;
		JWT_TIME_EXPIRATION?: string;
		COOKIE_NAME?: string;
		COOKIE_PRIVATE_KEY?: string;
		NODE_ENV?: 'development' | 'production';
	}
}
