import { Op } from 'sequelize';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import Plan from '../models/Plan.js';

class PlanController {
	async store(request, response) {
		const schema = Yup.object({
			name: Yup.string().required(),
			value: Yup.number().required(),
		});
		try {
			schema.validateSync(request.body, { abortEarly: false, strict: true });
		} catch (err) {
			return response.status(400).json({ message: err.errors });
		}

		const { name, value } = request.body;

		const existPlan = await Plan.findOne({
			where: {
				name,
			},
		});

		if (existPlan) {
			return response.status(400).json({ message: 'The plan already exists' });
		}

		const plan = await Plan.create({
			id: v4(),
			name,
			value,
		});

		return response.status(201).json(plan);
	}

	async index(_request, response) {
		try {
			const plans = await Plan.findAll();

			return response.status(200).json(plans);
		} catch (err) {
			return response.status(500).json({ message: err.message });
		}
	}

	async show(request, response) {
		try {
			const { name } = await request.query;

			const whereClause = name ? { name: { [Op.iLike]: `%${name}%` } } : {};

			const plans = await Plan.findAll({
				where: whereClause,
				attributes: ['id', 'name', 'value'],
			});

			return response.status(200).json(plans);
		} catch (err) {
			return response.status(500).json({ message: err.message });
		}
	}

	async update(request, response) {
		const { id } = request.params;

		const idSchema = Yup.string().uuid('Insira um ID válido.');

		try {
			idSchema.validateSync(id);
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
		try {
			const { id } = request.params;

			const { name, value } = request.body;

			const schema = Yup.object({
				name: Yup.string(),
				value: Yup.number(),
			});

			schema.validateSync(request.body, { abortEarly: false });

			const plan = await Plan.findByPk(id);
			if (!plan) {
				return response.status(404).json({ message: 'Plan not found.' });
			}

			if (name && name !== plan.name) {
				const existName = await Plan.findOne({
					where: {
						name,
					},
				});

				if (existName) {
					return response
						.status(400)
						.json({ message: 'Name already registered' });
				}
			}

			const updatePayload = {
				name,
				value,
			};

			await plan.update(updatePayload);

			return response.status(200).json({
				message: 'Plan successfully validated',
				user: {
					name: plan.name,
					value: plan.value,
				},
			});
		} catch (err) {
			return response.status(500).json({ message: 'Internal server error' });
		}
	}

	async delete(request, response) {
		try {
			const { id } = request.params;

			const plan = await Plan.findOne({
				where: { id },
			});

			if (!plan) {
				return response.status(404).json({ message: 'Enrollment not found.' });
			}

			await plan.destroy();

			return response.status(204).send();
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
	}
}

export default new PlanController();
