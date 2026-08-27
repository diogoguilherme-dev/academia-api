module.exports = {
	dialect: 'postgress',
	host: 'localhost',
	port: 5432,
	usename: 'admin',
	password: '123456',
	database: 'academia-db',
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
};
