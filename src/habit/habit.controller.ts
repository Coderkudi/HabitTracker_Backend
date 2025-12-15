import { type Request, type Response, Router } from 'express';
import verifyUser from '../middlewares/auth/jwtValidation.js';
import { handleError } from '../utils/apiError.js';
import { catchAsync } from '../utils/catchAsyncWrapper.js';
import { habitManager } from './habit.manager.js';
import { habitsTable } from '../utils/prisma.js';

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
        this.router.patch(
            '/:habitId/toggle/:dayIndex',
            verifyUser,
            catchAsync(this.toggleHabitDay.bind(this))
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
            console.error('GET HABITS ERROR:', error);
            return res.status(500).json({
                message: 'Failed to fetch habits',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    public async createHabit(req: Request, res: Response) {
        try {
            console.log('hello');

            console.log(req.body);

            const userInformation = req.userInformation;

            // console.log('world');
            const { habitName, habitDescription, habitIcon, categoryId } =
                req.body;
            console.log(habitName, habitDescription, categoryId);

            // if (!habitName || habitName.trim() === '') {
            // }

            const newHabit = await this._habitManager.createHabit(
                {
                    habitName,
                    habitDescription,
                    habitIcon: habitIcon || '⭐',
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

    async toggleHabitDay(req: Request, res: Response) {
        try {
            const { habitId, dayIndex } = req.params;
            const index = parseInt(dayIndex || '');

            if (isNaN(index) || index < 0 || index > 6) {
                return res.status(400).json({ message: 'Invalid day index' });
            }

            // Find habit
            const habit = await habitsTable.findUnique({
                where: { id: habitId },
            });

            if (!habit) {
                return res.status(404).json({ message: 'Habit not found' });
            }

            // Ensure completed array is always of length 7
            let completed = habit.completed;
            if (!Array.isArray(completed) || completed.length !== 7) {
                completed = Array(7).fill(false);
            }

            // *** TOGGLE SELECTED DAY ***
            completed[index] = !completed[index];

            // --- STREAK CALCULATION OPTION A ---
            // Today’s real weekday (0=Sunday, 1=Monday...)
            const jsToday = new Date().getDay();

            // Convert JS weekday → your habit array index (Mon=0 ... Sun=6)
            const normalizedToday = jsToday === 0 ? 6 : jsToday - 1;

            let newStreak = 0;

            // Step 1: Count backwards from today's index
            for (let i = normalizedToday; i >= 0; i--) {
                if (completed[i]) newStreak++;
                else break;
            }

            // Step 2: If streak reached the start of the week, wrap around from Sunday
            if (newStreak === normalizedToday + 1) {
                for (let i = 6; i > normalizedToday; i--) {
                    if (completed[i]) newStreak++;
                    else break;
                }
            }

            // Save updates
            const updatedHabit = await habitsTable.update({
                where: { id: habitId },
                data: {
                    completed,
                    streak: newStreak,
                },
            });

            return res.status(200).json({
                message: 'Day toggled successfully',
                updatedHabit,
            });
        } catch (error) {
            console.error('toggleHabitDay error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
