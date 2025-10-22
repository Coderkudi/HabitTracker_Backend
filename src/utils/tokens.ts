import * as jose from 'jose';

interface userInformationType {
    id: string;
    email: string;
}

export const generateAccessToken = async (
    userInformation: userInformationType
) => {
    try {
        const generatedToken = await new jose.SignJWT({
            userInformation,
        })
            .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .sign(
                new TextEncoder().encode(
                    process.env.ACCESS_TOKEN_SECRET as string
                )
            );
        return generatedToken;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Unknown error occured');
        }
    }
};

export const verifyAccessToken = async (
    token: string
): Promise<TokenPayload | false> => {
    try {
        const verifyAndDecodeToken = await jose.jwtVerify(
            token,
            new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
        );

        // Convert from JWTPayload -> unknown -> RefreshTokenPayload
        const payload = verifyAndDecodeToken.payload as unknown as TokenPayload;

        // Optional safety check:
        if (!payload.userInformation?.id || !payload.userInformation?.email) {
            throw new Error('Invalid token payload structure');
        }

        return payload;
    } catch {
        return false;
    }
};

export const generateRefreshToken = async (
    userInformation: userInformationType
) => {
    try {
        const generatedToken = await new jose.SignJWT({
            userInformation,
        })
            .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY as string)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .sign(
                new TextEncoder().encode(
                    process.env.REFRESH_TOKEN_SECRET as string
                )
            );
        return generatedToken;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('Unknown error occured');
        }
    }
};

interface TokenPayload {
    userInformation: {
        id: string;
        email: string;
    };
    iat?: number;
    exp?: number;
}

export const verifyRefreshToken = async (
    token: string
): Promise<TokenPayload | false> => {
    try {
        const verifyAndDecodeToken = await jose.jwtVerify(
            token,
            new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
        );

        // Convert from JWTPayload -> unknown -> RefreshTokenPayload
        const payload = verifyAndDecodeToken.payload as unknown as TokenPayload;

        // Optional safety check:
        if (!payload.userInformation?.id || !payload.userInformation?.email) {
            throw new Error('Invalid token payload structure');
        }

        return payload;
    } catch {
        return false;
    }
};
