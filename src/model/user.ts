import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},
		gamesPlayed: {
			type: Number,
			default: 0,
		},
		gamesWon: {
			type: Number,
			default: 0,
		},
		gamesLost: {
			type: Number,
			default: 0,
		},
		gamesDrawn: {
			type: Number,
			default: 0,
		},
		guest:{
			type:Boolean,
			default:false
		}
	},
	{ timestamps: true },
);

mongoose.plugin(mongoosePaginate);
export default userSchema;
