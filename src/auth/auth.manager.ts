import { userTable } from '../utils/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';

export class authManager {
    public async registerUser(userInformation: {
        name: string;
        email: string;
        userName: string;
        password: string;
    }) {
        try {
            const existingUser = await userTable.findFirst({
                where: {
                    email: userInformation.email,
                },
            });
            console.log(existingUser);
            if (existingUser) {
                throw new Error('Email allready exists');
            }
            const hashPassword = await Bun.password.hash(
                userInformation.password
            );

            const newUser = await userTable.create({
                data: {
                    email: userInformation.email,
                    name: userInformation.name,
                    userName: userInformation.userName,
                    password: hashPassword,
                },
            });
            console.log(newUser);
            return newUser;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unknown error occured');
            }
        }
    }

    public async loginUser(userInformation: {
        email: string;
        password: string;
    }) {
        try {
            const findEmail = await userTable.findFirst({
                where: {
                    email: userInformation.email,
                },
            });

            console.log('findemail', findEmail);
            // if(findEmail)
            if (findEmail?.password) {
                const isMatch = await Bun.password.verify(
                    userInformation.password,
                    findEmail.password
                );
                console.log(isMatch);
                if (!isMatch) {
                    throw new Error("password doesn't match");
                }
                const accessToken = await generateAccessToken({
                    id: findEmail.id,
                    email: findEmail.email,
                });
                const refreshToken = await generateRefreshToken({
                    id: findEmail.id,
                    email: findEmail.email,
                });

                if (accessToken && refreshToken) {
                    return {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };
                }
                throw new Error('Unable to generate Tokens');
            } else {
                throw new Error('Password not found');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }
    public async me(id: string) {
        try {
            const data = await userTable.findFirst({
                where: {
                    id: id,
                },
            });
            if (data) {
                return {
                    name: data.name,
                };
            }
            throw new Error("can't find data");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Unknown error occured');
        }
    }
}
