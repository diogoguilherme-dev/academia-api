import { Sequelize } from 'sequelize';
import Enrollment from '../app/models/Enrollment.js';
import Plan from '../app/models/Plan.js';
import User from '../app/models/User.js';
import databaseConfig from '../config/database.cjs';

const models = [User, Plan, Enrollment];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);
		models.map((model) => model.init(this.connection));

		models.forEach((model) => {
			if (model.associate) {
				model.associate(this.connection.models);
			}
		});
	}
}

export default new Database();
