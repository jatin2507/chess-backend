import mongoose from 'mongoose';
import logger from './logger';
import { config } from '../utils/config';
let mongodb = function () {
	return new Promise((resolve: any, reject: any) => {
		mongoose
			.connect(config.mongodbUrl)
			.then(() => {
				logger.info('Mongo Database Connected ...');
				resolve('');
			})
			.catch(reject);
	});
};

export default mongodb;