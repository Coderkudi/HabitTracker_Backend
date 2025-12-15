import { Router } from 'express';
import { authController } from './auth/auth.controller.js';
import { categoryController } from './category/category.controller.js';
import { habitController } from './habit/habit.controller.js';

const router = Router();
const routes = [
    {
        path: '/auth',
        route: new authController().router,
    },
    {
        path: '/category',
        route: new categoryController().router,
    },
    {
        path: '/habit',
        route: new habitController().router,
    },
];

routes.forEach(route => {
    router.use(route.path, route.route);
});
export default router;
