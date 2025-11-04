import { Router } from 'express';
import { authController } from './auth/auth.controller';
import { categoryController } from './category/category.controller';
import { habitController } from './habit/habit.controller';

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
