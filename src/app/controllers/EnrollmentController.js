import { v4 } from 'uuid';
import * as Yup from 'yup';
import Enrollment from '../models/Enrollment.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';

class EnrollmentController {
	async store(request, response) {
		const schema = Yup.object({
			user_id: Yup.string().required(),
			plan_id: Yup.string().required(),
		});

		try {
			schema.validateSync(request.body, { abortEarly: false, strict: true });
		} catch (err) {
			return response.status(400).json({ message: err.errors });
		}

		const { user_id, plan_id } = request.body;

		const user = await User.findByPk(user_id);
		if (!user) {
			return response.status(400).json({ message: 'User not found.' });
		}

		const plan = await Plan.findByPk(plan_id);
		if (!plan) {
			return response.status(400).json({ message: 'Plan not found.' });
		}

		const existEnrollment = await Enrollment.findOne({
			where: {
				user_id,
			},
		});

		if (existEnrollment) {
			return response
				.status(400)
				.json({ message: 'This registration number already exists.' });
		}

		const enrollment = await Enrollment.create({
			id: v4(),
			user_id: user_id,
			plan_id: plan_id,
		});

		return response.status(201).status({
			id: enrollment.id,
			user_id: enrollment.user_id,
			plan_id: enrollment.plan_id,
		});
	}
}

export default new EnrollmentController();
