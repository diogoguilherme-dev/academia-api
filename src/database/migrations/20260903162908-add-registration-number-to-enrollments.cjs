/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('enrollments', 'registration_number', {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: true,
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('enrollments', 'registration_number');
	},
};
