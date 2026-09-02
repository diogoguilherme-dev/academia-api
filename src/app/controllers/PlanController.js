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
}

export default new PlanController();
