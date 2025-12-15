import { AppError } from '../utils/apiError.js';
import { categoryTable } from '../utils/prisma.js';

export class categoryManager {
    public async categories(userInformation: { id: string; email: string }) {
        try {
            const categories = await categoryTable.findMany({
                where: {
                    userId: userInformation.id,
                },
            });
            if (categories) {
                return categories;
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }

    public async createCategory(
        categoryInformation: {
            categoryName: string;
            categoryDescription: string;
            categoryIcon: string;
        },
        userId: string
    ) {
        try {
            const existingCategory = await categoryTable.findFirst({
                where: {
                    name: categoryInformation.categoryName,
                    userId,
                },
            });
            console.log('existingCategory', existingCategory);
            if (existingCategory) {
                throw new AppError('category already exists', 409);
            }

            const newCategory = await categoryTable.create({
                data: {
                    name: categoryInformation.categoryName,
                    description: categoryInformation.categoryDescription,
                    icon: categoryInformation.categoryIcon || '📌',
                    userId,
                },
            });
            console.log('Category created', newCategory);
            return newCategory;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof Error) {
                throw new AppError(error.message, 500);
            }

            throw new AppError('Unknown error', 500);
        }

        // if (userId == existingCategory.userId) {
    }
}
