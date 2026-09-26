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

		if (!existEnrollment) {
			return response
				.status(400)
				.json({ message: 'This registration number already exists.' });
		}

		const enrollment = await Enrollment.create({
			id: v4(),
			user_id: user_id,
			plan_id: plan_id,
		});

		return response.status(201).json({
			id: enrollment.id,
			user_id: enrollment.user_id,
			plan_id: enrollment.plan_id,
			registration_number: enrollment.registration_number,
		});
	}

	async index(_request, response) {
		try {
			const enrollments = await Enrollment.findAll({
				include: [
					{ model: User, as: 'user', attributes: ['name', 'email'] },
					{ model: Plan, as: 'plan', attributes: ['name', 'value'] },
				],
			});

			return response.status(200).json(enrollments);
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
	}

	async show(request, response) {
		try {
			const { registration_number } = request.params;

			const enrollment = await Enrollment.findOne({
				where: { registration_number },
				include: [
					{ model: User, as: 'user', attributes: ['name', 'email'] },
					{ model: Plan, as: 'plan', attributes: ['name', 'value'] },
				],
			});

			if (!enrollment) {
				return response.status(404).json({ message: 'Enrollment not found.' });
			}

			return response.status(200).json(enrollment);
		} catch (err) {
			console.log(err);
			return response.status(400).json({ message: err.message });
		}
	}

	async delete(request, response) {
		try {
			const { registration_number } = request.params;

			const enrollment = await Enrollment.findOne({
				where: { registration_number },
			});

			if (!enrollment) {
				return response.status(404).json({ message: 'Enrollment not found.' });
			}

			await enrollment.destroy();

			return response.status(204).send();
		} catch (err) {
			return response.status(400).json({ message: err.message });
		}
	}
}

export default new EnrollmentController();
