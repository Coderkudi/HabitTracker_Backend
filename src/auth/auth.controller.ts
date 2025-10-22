import { type Request, type Response, Router } from 'express';
import verifyUser from '../middlewares/auth/jwtValidation';
import { catchAsync } from '../utils/catchAsyncWrapper';
import { authManager } from './auth.manager';

export class authController {
    public router = Router();
    private _authManager = new authManager();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post('/register', catchAsync(this.registerUser.bind(this)));
        this.router.post('/login', catchAsync(this.loginUser.bind(this)));
        this.router.get('/hello', catchAsync(this.hello.bind(this)));
        this.router.get('/me', verifyUser, catchAsync(this.me.bind(this)));
    }

    public async hello(req: Request, res: Response) {
        return res.status(200).json({
            message: 'Hello from the server',
        });
    }
    public async registerUser(req: Request, res: Response) {
        try {
            const { name, email, userName, password } = req.body;
            if (name && email && userName && password) {
                console.log(name, email, userName, password);
                const newUser = await this._authManager.registerUser({
                    name,
                    email,
                    userName,
                    password,
                });

                return res.status(201).json({
                    message: 'Successfully registered',
                    user: newUser,
                });
            }
            return res.status(404).json({ message: 'All fields are required' });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message == 'Email allready exists') {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        }
    }

    public async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const tokens = await this._authManager.loginUser({
                    email,
                    password,
                });
                console.log('tokens', tokens);
                res.cookie('accessToken', tokens?.accessToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });
                res.cookie('refreshToken', tokens?.refreshToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    path: '/',
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({ message: 'login Successfully' });
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("User doesn't exist ");
            }
        }
    }
    public async me(req: Request, res: Response) {
        try {
            const userInformation = req.userInformation;
            console.log('userinfo', userInformation);
            // console.log(userInformation);
            const data = await this._authManager.me(
                userInformation?.id as string
            );
            if (data) {
                return res.status(200).json({ message: `${data.name}` });
            }

            return res.status(500).json('something went wrong ');
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json(error.message);
            }
        }
    }
}
