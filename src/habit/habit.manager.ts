import { AppError } from '../utils/apiError';
import { habitsTable } from '../utils/prisma';

export class habitManager {
    public async habits(userInformation: { id: string; email: string }) {
        try {
            const habits = await habitsTable.findMany({
                where: {
                    userId: userInformation.id,
                },
            });
            if (habits) {
                return habits;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error fetching habits');
            }
            throw new Error('failed to fetch habits');
        }
    }

    public async createHabit(
        habitInformation: {
            habitName: string;
            habitDescription: string;
            categoryId: string;
        },
        userId: string
    ) {
        try {
            // const category = await categoryTable.findFirst({
            //     where: {
            //         name: habitInformation.habitCategoryName,
            //         userId,
            //     },
            // });

            // if (!category) throw new Error('Category not found');

            const existingHabit = await habitsTable.findFirst({
                where: {
                    name: habitInformation.habitName,
                    userId: userId,
                },
            });
            console.log('existingHabit', existingHabit);
            if (existingHabit) {
                throw new AppError('Habbit already exits', 409);
            }

            const newHabit = await habitsTable.create({
                data: {
                    name: habitInformation.habitName,
                    description: habitInformation.habitDescription,
                    categoryId: habitInformation.categoryId,
                    userId: userId,
                },
            });
            return newHabit;
            //  else {
            //     throw new Error('Category not found');
            // }
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            } else if (error instanceof Error) {
                throw new AppError(error.message, 500);
            }
        }
    }
}
