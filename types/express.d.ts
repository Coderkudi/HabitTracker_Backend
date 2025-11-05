import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        userInformation?: {
            id: string;
            email: string;
        };
    }
}
