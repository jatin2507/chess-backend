import { addToFindRoomQueue } from '../../Bull/Queue/findRoom';
import { getKey } from '../../loaders/redis';
import { handler } from '../../utils/ErrorHandler';
import { NotificationType } from '../../utils/const';
import { find } from '../../utils/db';
import { addUserToRoom, response } from '../../utils/socket.common';

async function findRoomEventTmp(prop: any) {
	let { data } = prop;
	//check if user is in room
	let oldRoom = await getKey('pi', data._id);

	if (oldRoom.roomId) {
		let findRoom = await getKey('tgp', oldRoom.roomId);
		if (!findRoom)
			return response('fail', {
				msg: NotificationType.FAIL.OPPONENT_IS_DISCONNECTED,
				_id: data._id,
			});
		addUserToRoom(oldRoom.roomId);
		if (findRoom.players.length != 2)
			return response('playes:waiting', { _id: data._id }, 'socket');
		return response('match:found', { _id: data._id, ...findRoom, isWaiting: false });
	}
	//add to queue for findRoom and add to into room
	addToFindRoomQueue(data);
}

let findRoomEvent = handler(findRoomEventTmp);
export { findRoomEvent };
