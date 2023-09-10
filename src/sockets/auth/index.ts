import { handler } from '../../utils/ErrorHandler';
import { guest, userInfo } from './auth';

async function authEventsTmp(prop: any) {
	let event = prop['data']['event'].split(':')[1];
	switch (event) {
		case 'guest':
			await guest(prop);
			break;
		case 'userInfo':
			await userInfo(prop);
			break;
	}
}

let authEvents = handler(authEventsTmp);
export { authEvents };
	