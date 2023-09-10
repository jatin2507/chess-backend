import mongoose from 'mongoose';
import userSchema from './user';

let Schema = {
	users: mongoose.model('users', userSchema),
};

export default Schema;
