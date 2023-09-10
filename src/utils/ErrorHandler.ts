import logger from '../loaders/logger';
import { setKey } from '../loaders/redis';

export let handler = function (fun: any) {
	if (typeof fun !== 'function') throw new Error('handler must be a function');
	return async function (...args: any) {
		try {
			await fun(...args);
		} catch (error) {
			logger.error(`Error got In ${fun.name} : `);
			logger.error(error);
		}
	};
};


