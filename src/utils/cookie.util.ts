export const formatTypeToken = (token: string): string => {
	return `Bearer ${token}`;
};

export const cookieConfig = {
	httpOnly: true,
	path: process.env.GLOBAL_PREFIX,
	secure: process.env.NODE_ENV === 'production',
};
