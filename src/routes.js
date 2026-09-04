import { Router } from 'express';
import EnrollmentController from './app/controllers/EnrollmentController.js';
import PlanController from './app/controllers/PlanController.js';
import UserController from './app/controllers/UserController.js';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/plans', PlanController.store);
routes.post('/enrollments', EnrollmentController.store);

routes.get('/users', UserController.index);
routes.get('/plans', PlanController.index);
routes.get('/enrollments', EnrollmentController.index);

routes.get('/users', UserController.show);
routes.get('/plans', PlanController.show);
routes.get('/enrollments/:registration_number', EnrollmentController.show);

routes.delete('/users/:id', UserController.delete);
routes.delete('/plans/:id', PlanController.delete);
routes.delete('/enrollments/:registration_number', EnrollmentController.delete);

export default routes;
