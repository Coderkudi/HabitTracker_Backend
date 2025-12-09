import { type Request, type Response, Router } from 'express';
import verifyUser from '../middlewares/auth/jwtValidation';
import { handleError } from '../utils/apiError';
import { catchAsync } from '../utils/catchAsyncWrapper';
import { habitManager } from './habit.manager';

export class habitController {
    public router = Router();
    private _habitManager = new habitManager();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            '/hello',
            verifyUser,
            catchAsync(this.hello.bind(this))
        );
        this.router.post(
            '/',
            verifyUser,
            catchAsync(this.createHabit.bind(this))
        );
        this.router.get('/', verifyUser, catchAsync(this.getHabit.bind(this)));
    }

    public async hello(req: Request, res: Response) {
        return res.status(200).json({
            message: 'Hello from habit test route',
        });
    }

    public async getHabit(req: Request, res: Response) {
        try {
            const userInformation = req.userInformation;
            if (userInformation) {
                const habits = await this._habitManager.habits(userInformation);
                if (habits) {
                    console.log('Habits getted: ', habits);
                    return res.status(200).json(habits);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('error fetching habits ');
            }
            return res.status(500).json({ message: 'Failed to fetch habits' });
        }
    }

    public async createHabit(req: Request, res: Response) {
        try {
            console.log('hello');

            console.log(req.body);

            const userInformation = req.userInformation;

            // console.log('world');
            const { habitName, habitDescription, categoryId } = req.body;
            console.log(habitName, habitDescription, categoryId);

            // if (!habitName || habitName.trim() === '') {
            // }

            const newHabit = await this._habitManager.createHabit(
                {
                    habitName,
                    habitDescription,
                    categoryId,
                },
                userInformation?.id || ''
            );
            return res.status(201).json({
                message: 'Successfully created the habit',
                data: newHabit,
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}
