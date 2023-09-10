import { idGen, tokenGen, tokenValue, valueGen } from '../../utils/common';
import { addUserToRoom, response } from '../../utils/socket.common';
import { handler } from '../../utils/ErrorHandler';
import { findOne, insertOne } from '../../utils/db';
import { getKey, setKey } from '../../loaders/redis';
async function guestTmp(prop: any = {}) {
	let { event, payload } = prop['data'];
	let data: any = await insertOne({
		collection: 'users',
		document: { username: 'Guest' + idGen().split('-')[0], guest: true },
	});

	payload = {
		...payload,
		token: tokenGen({ _id: data._id.toString(), role: 'guest' }),
		_id: data._id.toString(),
	};
	addUserToRoom(data._id.toString());
	response('auth:token', payload);
}

async function userInfoTmp(prop: any = {}) {
	let { event, payload, _id, username } = prop['data'];
	let findUserProfile = await getKey('pi', _id.toString());
	if (!findUserProfile) {
		await setKey('pi', _id.toString(), {
			status: 'online',
			roomId: '',
			username,
		});
	}
	addUserToRoom(_id.toString());
	response(event, { ...prop['data'] });
}

let guest = handler(guestTmp);
let userInfo = handler(userInfoTmp);
export { guest, userInfo };
