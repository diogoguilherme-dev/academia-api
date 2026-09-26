import { Router } from 'express';
import EnrollmentController from './app/controllers/EnrollmentController.js';
import PlanController from './app/controllers/PlanController.js';
import UserController from './app/controllers/UserController.js';

const routes = new Router();

// === ROTAS PARA CRIAR ===
routes.post('/users', UserController.store);
routes.post('/plans', PlanController.store);
routes.post('/enrollments', EnrollmentController.store);

// === ROTAS PARA BUSCAR TODOS ===
routes.get('/users', UserController.index);
routes.get('/plans', PlanController.index);
routes.get('/enrollments', EnrollmentController.index);

// === ROTAS PARA BUSCAR ESPECÍFICO ===
routes.get('/user', UserController.show);
routes.get('/plan', PlanController.show);
routes.get('/enrollments/:registration_number', EnrollmentController.show);

// === ROTAS PARA ATUALIZAR ===
routes.put('/user/:id', UserController.update);
routes.put('/plan/:id', PlanController.update);

// === ROTAS PARA DELETAR ===
routes.delete('/users/:id', UserController.delete);
routes.delete('/plans/:id', PlanController.delete);
routes.delete('/enrollments/:registration_number', EnrollmentController.delete);

export default routes;
