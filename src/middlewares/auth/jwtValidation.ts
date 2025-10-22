import { type NextFunction, type Request, type Response } from 'express';
import {
    generateAccessToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../../utils/tokens';

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        console.log(accessToken, refreshToken);

        if (accessToken) {
            const decodedData = await verifyAccessToken(accessToken);
            if (decodedData) {
                req.userInformation = decodedData.userInformation;
                return next();
            }
        }

        if (refreshToken) {
            const decodedData = await verifyRefreshToken(refreshToken);
            if (decodedData) {
                const newAccessToken = await generateAccessToken({
                    id: decodedData.userInformation.id,
                    email: decodedData.userInformation.email,
                });

                req.userInformation = decodedData.userInformation;
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });
                return next();
            }
        }

        // if neither token is valid
        return res.status(401).json({ message: 'login required' });
    } catch (error) {
        console.log('middleware error :-> ', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Authentication failed' });
        }
    }
};

export default verifyUser;
