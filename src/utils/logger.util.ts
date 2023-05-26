import winston from 'winston';

const customLevels = {
	levels: {
		trace: 0,
		input: 1,
		verbose: 2,
		prompt: 3,
		debug: 4,
		info: 5,
		data: 6,
		help: 7,
		warn: 8,
		error: 9,
	},

	colors: {
		trace: 'magenta',
		input: 'grey',
		verbose: 'cyan',
		prompt: 'grey',
		debug: 'blue',
		info: 'green',
		data: 'grey',
		help: 'cyan',
		warn: 'yellow',
		error: 'red',
	},
};

// * Using the printf format.
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `[${level}] ${timestamp} - ${message}`;
});

winston.addColors(customLevels.colors);

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format((info) => {
			info.level = info.level.toUpperCase();
			return info;
		})(),
		winston.format.colorize({ all: true }),
		winston.format.timestamp({ format: 'HH:mm:ss' }),
		customFormat,
	),

	transports: [new winston.transports.Console()],
});
