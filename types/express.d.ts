// import 'express';

// declare module 'express-serve-static-core' {
//     interface Request {
//         userInformation?: {
//             id: string;
//             email: string;
//         };
//     }
// }

import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            userInformation?: {
                id: string;
                email: string;
            };
        }
    }
}

export {};
