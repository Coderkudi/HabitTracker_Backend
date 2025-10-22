import { Router } from 'express';
import { authController } from './auth/auth.controller';

const router = Router();
const routes = [
    {
        path: '/auth',
        route: new authController().router,
    },
];

routes.forEach(route => {
    router.use(route.path, route.route);
});
export default router;
