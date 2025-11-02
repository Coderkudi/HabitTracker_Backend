import { Router } from 'express';
import { authController } from './auth/auth.controller';
import { categoryController } from './category/category.controller';

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
];

routes.forEach(route => {
    router.use(route.path, route.route);
});
export default router;
