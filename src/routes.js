import { Router } from 'express';
import EnrollmentController from './app/controllers/EnrollmentController.js';
import PlanController from './app/controllers/PlanController.js';
import UserController from './app/controllers/UserController.js';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/plan', PlanController.store);
routes.post('/enrollment', EnrollmentController.store);

export default routes;
