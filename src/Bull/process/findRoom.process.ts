import logger from '../../loaders/logger';
import { getKey, lpop, rpush, setKey } from '../../loaders/redis';
import { idGen } from '../../utils/common';
import { findOne } from '../../utils/db';
import { addUserToRoom, response } from '../../utils/socket.common';
import { NotificationType } from '../../utils/const';

async function proccser({ data }: any) {
	let findCache = await getKey('pi', data._id);
	delete data.event;
	delete data.payload;
	if (!findCache) {
		response('fail', {
			msg: NotificationType.FAIL.PLAYER_NOT_FOUND,
			error: true,
			_id: data._id,
			isWaiting: false,
		});
		return { msg: NotificationType.FAIL.PLAYER_NOT_FOUND, _id: data._id };
	}
	if (findCache == 'offline') {
		response('fail', {
			msg: NotificationType.FAIL.PLAYER_IS_OFFLINE,
			error: true,
			_id: data._id,
			isWaiting: false,
		});
		return { msg: NotificationType.FAIL.PLAYER_IS_OFFLINE, _id: data._id };
	}
	let waitingRoom = await lpop('wl');
	if (!waitingRoom) {
		let roomId = idGen();
		let newRoom = await setKey('tgp', roomId, {
			_id: roomId,
			players: [data._id],
			roomStatus: 'waiting',
			time: Date.now(),
			playersInfo: [{ ...data }],
		});
		await setKey('pi', data._id, { ...findCache, roomId });
		await rpush('wl', roomId);
		addUserToRoom(roomId);
		response('playes:waiting', {
			msg: NotificationType.LOBBY.WAIT_FOR_PLAYER,
			_id: data._id,
			isWaiting: true,
		});
		return { msg: NotificationType.LOBBY.WAIT_FOR_PLAYER, _id: data._id };
	}
	let findRoom = await getKey('tgp', waitingRoom);
	console.log('findRoom', findRoom);
	if (findRoom.players.length == 2) {
		response('fail', {
			msg: NotificationType.FAIL.ROOM_IS_FULL,
			_id: data._id,
			isWaiting: true,
		});
		return { msg: NotificationType.FAIL.ROOM_IS_FULL, _id: data._id };
	}
	if (findRoom.players.length == 1 && findRoom?.players?.includes(data._id)) {
		response('playes:waiting', {
			msg: NotificationType.LOBBY.WAIT_FOR_PLAYER,
			_id: data._id,
			isWaiting: true,
		});
		return { msg: NotificationType.LOBBY.WAIT_FOR_PLAYER, _id: data._id };
	}
	addUserToRoom(waitingRoom);
	await setKey('pi', data._id, { ...findCache, roomId: waitingRoom });
	let userDetails = {
		...findRoom,
		roomStatus: 'playing',
		userDisconnect: false,
		players: [...findRoom.players, data._id],
		playersInfo: [...findRoom.playersInfo, { ...data }],
	};
	await setKey('tgp', waitingRoom, userDetails);
	let opponent = await findOne({ collection: 'users', query: { _id: findRoom.players[0] } });
	response('match:found', { _id: waitingRoom, ...userDetails , isWaiting: false });
}
function onCompleted(job: any, result: any) {
	logger.info('onCompleted ... ' + JSON.stringify(result));
}
function onError(error: any) {
	logger.info('onError ...' + JSON.stringify(error));
}

export { proccser, onCompleted, onError };
