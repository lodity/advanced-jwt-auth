import { Schema } from 'mongoose';

const TokenSchema = new Schema({
	isActivated: { type: Schema.Types.ObjectId, ref: 'User' },
	refreshToken: { type: String, required: true },
});

export default Schema.model('Token', TokenSchema);
