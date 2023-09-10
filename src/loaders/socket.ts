import { Server } from 'socket.io';
import logger from './logger';
import { global } from '../utils/Global';
import { handler } from '../utils/ErrorHandler';
import socketEvents from '../sockets';
import { tokenValue } from '../utils/common';
import { authEvents } from '../sockets/auth';
import { response } from '../utils/socket.common';
import { findOne } from '../utils/db';

export default function socketConnection(server: any) {
	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
		transports: ['websocket', 'polling'],
		pingTimeout: 60000,
		allowEIO3: true,
	});
	global.io = io;
	io.on('connection', (socket) => {
		logger.info(
			'\n\n\n----------------------------------------- New Session ' +
				socket.id +
				' -----------------------------------------',
		);
		global.socket = socket;

		socket.on('Request', async (data) => {
			console.log('Data', data);
			//allow auth events
			if (data['event']?.split(':')?.[0] == 'auth')
				return await authEvents({
					id: socket.id,
					data: { ...data },
				});
			//check if token is valid
			let token = data.payload.token;
			delete data.payload.token;
			if (!token) return response('auth:userInfo', { error: true, errorMsg: 'Token Not Found' });
			console.log(token);
			let value: any = tokenValue(token);
			if (!value)
				return response('auth:userInfo', { error: true, errorMsg: 'Token Not Is Not Valid' });
			let user = await findOne({
				collection: 'users',
				query: {
					_id: value._id,
					guest: value.role === 'guest',
				},
			});
			if (!user) return response('auth:userInfo', { error: true, errorMsg: 'User Not Found' });
			socket.join(value._id);
			await handler(socketEvents)({
				id: socket.id,
				data: { ...data, ...user },
			});
		});
		socket.on('disconnect', () => {
			logger.info(
				'----------------------------------------- Session ---- Over ' +
					socket.id +
					' -----------------------------------------\n\n\n',
			);
		});
	});
}
