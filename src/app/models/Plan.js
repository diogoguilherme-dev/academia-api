import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					primaryKey: true,
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
				},
				name: Sequelize.STRING,
				value: Sequelize.DECIMAL,
			},
			{
				sequelize,
			},
		);
	}

	static associate(models) {
		this.hasMany(models.Enrollment, {
			foreignKey: 'plan_id',
			as: 'enrollments',
		});
	}
}

export default Plan;
