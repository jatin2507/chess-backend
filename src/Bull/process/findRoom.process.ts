import { get } from 'mongoose';
import logger from '../../loaders/logger';
import { getKey, lpop, rpush, setKey } from '../../loaders/redis';
import { idGen } from '../../utils/common';
import { findOne } from '../../utils/db';
import { addUserToRoom, response } from '../../utils/socket.common';
import { NotificationType } from '../../utils/const';
import { add } from 'winston';

async function proccser({ data }: any) {
	console.log('data', data);
	let findCache = await getKey('pi', data._id);
	if (!findCache) {
		response('playes:fail', {
			msg: NotificationType.FAIL.PLAYER_NOT_FOUND,
			error: true,
			_id: data._id,
			isWaiting: false,
		});
		return { msg: NotificationType.FAIL.PLAYER_NOT_FOUND, _id: data._id };
	}
	if (findCache == 'offline') {
		response('playes:fail', {
			msg: NotificationType.FAIL.PLAYER_IS_OFFLINE,
			error: true,
			_id: data._id,
			isWaiting: false,
		});
		return { msg: NotificationType.FAIL.PLAYER_IS_OFFLINE, _id: data._id };
	}
	let waitingRoom = await lpop('waitingRoom');
	if (!waitingRoom) {
		let roomId = idGen();
		let newRoom = await setKey('tgp', roomId, {
			_id: roomId,
			players: [data._id],
			roomStatus: 'waiting',
			time: Date.now(),
		});
		await setKey('pi', data._id, { ...findCache, roomId });
		await rpush('waitingRoom', roomId);
		addUserToRoom(roomId);
		response('playes:waiting', {
			msg: NotificationType.LOBBY.WAIT_FOR_PLAYER,
			_id: data._id,
			isWaiting: true,
		});
		return { msg: NotificationType.LOBBY.WAIT_FOR_PLAYER, _id: data._id };
	}
	let findRoom = await getKey('tgp', waitingRoom);
	if (findRoom.players.length == 2) {
		response('playes:fail', {
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
	await setKey('tgp', waitingRoom, {
		...findRoom,
		players: [...findRoom.players, data._id],
	});
	let opponent = await findOne({ collection: 'users', query: { _id: findRoom.players[0] } });
	response('playes:found', { _id: data._id, isWaiting: false, opponent });
	response('match:found', { _id: waitingRoom });
}
function onCompleted(job: any, result: any) {
	logger.info('onCompleted ... '+ result);
}
function onError(error: any) {
	logger.info('onError ...' + error);
}

export { proccser, onCompleted, onError };
