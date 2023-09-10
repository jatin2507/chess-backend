import { addToFindRoomQueue } from '../../Bull/Queue/findRoom';
import { getKey } from '../../loaders/redis';
import { handler } from '../../utils/ErrorHandler';

async function findRoomEventTmp(prop: any) {
	let { data } = prop;
	//check if user is in room
	let oldRoom = await getKey('pi', data._id);
	if (oldRoom) {
	}
	//add to queue for findRoom and add to into room
	addToFindRoomQueue(data);
}

let findRoomEvent = handler(findRoomEventTmp);
export { findRoomEvent };
