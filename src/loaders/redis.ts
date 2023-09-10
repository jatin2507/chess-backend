import * as rd from 'redis';
import { config } from '../utils/config';
import logger from './logger';
import { indexConst } from '../utils/const';

let redis = rd.createClient({
	...config.redis,
});
let redisClient = async function () {
	return new Promise((resolve, reject) => {
		redis
			.connect()
			.then(() => {
				logger.info('Redis Database Connected ...');
				resolve('');
			})
			.catch(reject);
	});
};

async function setKey(index: string, id: string | number, value?: any) {
	try {
		value = (typeof value == 'object' && JSON.stringify(value)) || value;
		return await redis.set(`${indexConst[index]}:${id}`, value);
	} catch (e) {
		logger.error(e);
	}
}

async function getKey(index: string, id: string | number) {
	try {
		let value: any = await redis.get(`${indexConst[index]}:${id}`);
		if (!value) return null;
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	} catch (e) {
		logger.error(e);
	}
}

async function rpush(index: string, value: any) {
	try {
		value = (typeof value == 'object' && JSON.stringify(value)) || value;
		return await redis.rPush(`${indexConst[index]}`, value);
	} catch (e) {
		logger.error(e);
	}
}
async function lpop(index: string) {
	try {
		let value: any = await redis.lPop(`${indexConst[index]}`);
		if (!value) return false;
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	} catch (e) {
		logger.error(e);
	}
}

export { redisClient, setKey, getKey, rpush, lpop };
