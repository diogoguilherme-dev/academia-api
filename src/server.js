import app from './app.js';
import './database/index.js';

const port = 3001;

app.listen(port, () => {
	console.log(`Application is running on port: ${port}`);
});
