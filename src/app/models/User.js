import Sequelize, { Model } from 'sequelize';

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					primaryKey: true,
					type: Sequelize.UUID,
					defaultValue: Sequelize.UUIDV4,
				},
				cpf: Sequelize.STRING,
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				password_hash: Sequelize.STRING,
				admin: Sequelize.BOOLEAN,
			},
			{
				sequelize,
				tableName: 'users',
			},
		);
	}

	static associate(models) {
		this.hasMany(models.Enrollment, {
			foreignKey: 'user_id',
			as: 'enrollments',
		});
	}
}

export default User;
