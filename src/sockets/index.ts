import logger from '../loaders/logger';
import { handler } from '../utils/ErrorHandler';
import { authEvents } from './auth';
import { userInfo } from './auth/auth';
import { playesEvent } from './playes';

export default async function socketEvents(prop: any) {
	let event = prop['data']['event'].split(':')[0];
	switch (event) {
		case 'playes':
			await playesEvent(prop);
			break;
		case 'info':
			await userInfo(prop);
		default:
			logger.error('Default Event In Index File', prop);
	}
}
