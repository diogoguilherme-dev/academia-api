import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
	async store(request, response) {
		const schema = Yup.object({
			name: Yup.string().required(),
			cpf: Yup.string()
				.required()
				.matches(
					/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
					'Informe um CPF válido no formato com ou sem pontos/traço',
				),
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
				.json({ message: 'This email is already registered.' });
		}

		const existCpf = await User.findOne({
			where: {
				cpf,
			},
		});

		if (existCpf) {
			return response
				.status(400)
				.json({ message: 'The CPF is already registered.' });
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

	async index(_request, response) {
		try {
			const users = await User.findAll();

			return response.status(200).json(users);
		} catch (err) {
			return response.status(500).json({ message: err.message });
		}
	}

	async show(request, response) {
		try {
			const { name } = await request.query;
			console.log(name);

			const whereClause = name ? { name: { [Op.iLike]: `%${name}%` } } : {};

			const users = await User.findAll({
				where: whereClause,
				attributes: ['id', 'name', 'email'],
			});

			return response.status(200).json(users);
		} catch (err) {
			return response.status(500).json({ message: err.message });
		}
	}

	async update(request, response) {
		const { id } = request.params;

		const idSchema = Yup.string().uuid('Insira um id válido.');

		try {
			idSchema.validateSync(id);
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
		try {
			const { id } = request.params;

			const { name, email, cpf, password } = request.body;

			const schema = Yup.object({
				name: Yup.string(),
				cpf: Yup.string().matches(
					/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
					'Informe um CPF válido no formato com ou sem pontos/traço',
				),
				email: Yup.string().email(),
				password: Yup.string().min(6),
			});

			schema.validateSync(request.body, { abortEarly: false });

			const user = await User.findByPk(id);
			console.log(user);
			if (!user) {
				return response.status(404).json({ message: 'User not found.' });
			}

			if (email && email !== user.email) {
				const existEmail = await User.findOne({
					where: {
						email,
					},
				});

				if (existEmail) {
					return response
						.status(400)
						.json({ message: 'This email is already registered.' });
				}
			}

			if (cpf && cpf !== user.cpf) {
				const existCpf = await User.findOne({
					where: {
						cpf,
					},
				});

				if (existCpf) {
					return response
						.status(400)
						.json({ message: 'This CPF is already registered.' });
				}
			}

			const updatePayload = { name, email, cpf };

			if (password) {
				updatePayload.password_hash = await bcrypt.hash(password, 10);
			}

			await user.update(updatePayload);

			return response.status(200).json({
				message: 'User successfully updated',
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				const errorMessages = err.inner.map((error) => error.message);
				return response.status(400).json({ erros: errorMessages });
			}
			console.error(err);
			return response.status(500).json({ message: 'Internal server error.' });
		}
	}

	async delete(request, response) {
		try {
			const { id } = request.params;

			const user = await User.findOne({
				where: { id },
			});

			if (!user) {
				return response
					.status(404)
					.json({ message: 'This user does not exist.' });
			}

			await user.destroy();

			return response.status(204).send();
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
	}
}

export default new UserController();
