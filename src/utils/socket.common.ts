import logger from '../loaders/logger';
import { handler } from './ErrorHandler';
import { global } from './Global';
function responseTmp(event: string, payload: any, type: 'socket' | 'room' = 'room') {
	let { io, socket } = global;
	logger.warn({ log: 'Response Event', socketId: socket.id, event, payload });
	if (type == 'socket') socket.emit('Response', { event, payload: { error: true, ...payload } });
	if (!payload?._id) return logger.error('Socket Id Is Not Found');
	io.in(payload?._id?.toString()).emit('Response', {
		event,
		payload: { error: false, ...payload },
	});
}
function addUserToRoomTmp(room: string) {
	let { socket } = global;
	socket.join(room);
}
let response = handler(responseTmp);
let addUserToRoom = handler(addUserToRoomTmp);
export { response, addUserToRoom };
