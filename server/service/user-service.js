import 'dotenv/config';
import UserModel from '../models/user-model.js';
import bcrypt from 'bcrypt';
import mailService from './mail-service.js';
import tokenService from './token-service.js';
import UserDto from '../dto/user-dto.js';
import { v4 } from 'uuid';

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw new Error(`User with email address ${email} already exist`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = v4();

		const user = await UserModel.create({
			email,
			password: hashPassword,
			activationLink,
		});
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		);

		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({ ...userDto });
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return { ...tokens, user: userDto };
	}
}

export default new UserService();
