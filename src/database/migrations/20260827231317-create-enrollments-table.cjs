/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('enrollments', {
			id: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			plan_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: 'plans', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('enrollments');
	},
};
