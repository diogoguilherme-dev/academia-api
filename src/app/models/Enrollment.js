import Sequelize, { Model } from 'sequelize';
import enrollmentHook from '../../hooks/enrollmentHook.js';

class Enrollment extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					primaryKey: true,
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
				},
				user_id: {
					type: Sequelize.UUID,
					references: { model: 'users', key: 'id' },
				},
				plan_id: {
					type: Sequelize.UUID,
					references: { model: 'plans', key: 'id' },
				},
				registration_number: Sequelize.INTEGER,
			},
			{
				sequelize,
			},
		);

		this.addHook('beforeCreate', enrollmentHook);

		return this;
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
		this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
	}
}

export default Enrollment;
