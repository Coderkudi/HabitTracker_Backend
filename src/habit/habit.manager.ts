import { Prisma } from '../../generated/prisma/index.js';
import { AppError } from '../utils/apiError.js';
import { habitsTable } from '../utils/prisma.js';

export class habitManager {
    public async habits(userInformation: { id: string; email: string }) {
        try {
            const habits = await habitsTable.findMany({
                where: {
                    userId: userInformation.id,
                },
                include: {
                    category: true,
                },
            });
            if (habits) {
                return habits;
            }
        } catch (error) {
            console.error('MANAGER HABITS ERROR:', error);
            throw error; // don't wrap
        }
    }

    public async createHabit(
        habitInformation: {
            habitName: string;
            habitDescription: string;
            habitIcon: string;
            categoryId: string;
        },
        userId: string
    ) {
        try {
            const existingHabit = await habitsTable.findFirst({
                where: {
                    name: habitInformation.habitName,
                    userId: userId,
                },
            });
            console.log('existingHabit', existingHabit);
            if (existingHabit) {
                throw new AppError('Habbit already exists', 409);
            }

            const newHabit = await habitsTable.create({
                data: {
                    name: habitInformation.habitName,
                    description: habitInformation.habitDescription,
                    icon: habitInformation.habitIcon,
                    categoryId: habitInformation.categoryId,
                    userId: userId,
                    completed: Array(7).fill(false),
                    streak: 0,
                },
                include: {
                    category: true,
                },
            });
            return newHabit;
            //  else {
            //     throw new Error('Category not found');
            // }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof Error) {
                throw new AppError(error.message, 500);
            }

            throw new AppError('Unknown error', 500);
        }
    }
}
