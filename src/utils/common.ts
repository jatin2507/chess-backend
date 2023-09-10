import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { config } from './config';
export let idGen = () => {
	return uuidv4();
};

export let tokenGen = (payload: any) => {
	return jwt.sign(payload, config.privateKey, {
		expiresIn: '365d',
	});
};

export let tokenValue = (token: any) => {
	try {
		let value = jwt.verify(token, config.privateKey);
		return value;
	} catch (error) {
		return false;
	}
};

export let valueGen = (length: number) => {
	return Math.floor(Math.random() * length);
};
