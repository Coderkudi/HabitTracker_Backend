import { categoryTable, habitsTable } from '../utils/prisma';

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
            habitCategoryName: string;
        },
        userId: string
    ) {
        try {
            const category = await categoryTable.findFirst({
                where: {
                    name: habitInformation.habitCategoryName,
                    userId,
                },
            });

            if (!category) throw new Error('Category not found');

            const existingHabit = await habitsTable.findFirst({
                where: {
                    name: habitInformation.habitName,
                    userId: userId,
                },
            });
            console.log('existingHabit', existingHabit);
            if (existingHabit) {
                throw new Error(`${habitInformation.habitName} already exists`);
            }

            const newHabit = await habitsTable.create({
                data: {
                    name: habitInformation.habitName,
                    description: habitInformation.habitDescription,
                    categoryId: category?.id,
                    userId: userId,
                },
            });
            console.log('Habit created', newHabit);
            return newHabit;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    `The habit with the name ${habitInformation.habitName} already exists for this user `
                );
            }
        }
    }
}
