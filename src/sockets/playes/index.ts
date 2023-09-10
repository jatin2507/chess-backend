import { handler } from '../../utils/ErrorHandler';
import { findRoomEvent } from './roomJoin';


async function playesEventTmp(prop: any) {
	let event = prop['data']['event'].split(':')[1];
	switch (event) {
		case 'findRoom':
			await findRoomEvent(prop);
	}
}
let playesEvent = handler(playesEventTmp);
export { playesEvent };
