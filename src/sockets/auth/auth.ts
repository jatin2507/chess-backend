import { idGen, tokenGen, tokenValue, valueGen } from '../../utils/common';
import { addUserToRoom, response } from '../../utils/socket.common';
import { handler } from '../../utils/ErrorHandler';
import { findOne, insertOne } from '../../utils/db';
import { setKey } from '../../loaders/redis';
async function guestTmp(prop: any = {}) {
	let { event, payload } = prop['data'];
	let data: any = await insertOne({
		collection: 'users',
		document: { username: 'Guest' + idGen().split('-')[0], guest: true },
	});
	await setKey('pi', data._id.toString(), {
		status: 'online',
		roomId: '',
		username: data.username,
	});
	payload = {
		...payload,
		token: tokenGen({ _id: data._id.toString(), role: 'guest' }),
		_id: data._id.toString(),
	};
	addUserToRoom(data._id.toString());
	response(event, payload);
}

async function userInfoTmp(prop: any = {}) {
	let { event, payload } = prop['data'];
	let token: any = tokenValue(payload.token);
	if (!payload.token)
		return response(event, { error: true, errorMsg: 'Token Not Found', _id: prop._id });
	let findUser = await findOne({
		collection: 'users',
		query: {
			_id: token._id,
			guest: token.role === 'guest',
		},
	});
	if (!findUser)
		return response(event, { error: true, errorMsg: 'User Not Found', _id: token._id });

	response(event, { ...findUser });
}

let guest = handler(guestTmp);
let userInfo = handler(userInfoTmp);
export { guest, userInfo };
