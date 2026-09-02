import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
	async store(request, response) {
		const schema = Yup.object({
			name: Yup.string().required(),
			cpf: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().min(6).required(),
			admin: Yup.boolean().required(),
		});
		try {
			schema.validateSync(request.body, { abortEarly: false, strict: true });
		} catch (err) {
			return response.status(400).json({ error: err.errors });
		}

		const { name, cpf, email, password, admin } = request.body;

		const existUser = await User.findOne({
			where: {
				email,
			},
		});

		if (existUser) {
			return response
				.status(400)
				.json({ message: 'This email is already registered' });
		}

		const password_hash = await bcrypt.hash(password, 10);

		const user = await User.create({
			id: v4(),
			name,
			cpf,
			email,
			password_hash,
			admin,
		});

		return response.status(201).json({
			id: user.id,
			name: user.name,
			cpf: user.cpf,
			email: user.email,
			admin: user.admin,
		});
	}
}

export default new UserController();
