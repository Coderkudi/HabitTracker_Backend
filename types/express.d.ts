import 'express';

declare module 'express-serve-static-core' {
    export interface Request {
        userInformation?: { id: string; email: string };
    }
}
