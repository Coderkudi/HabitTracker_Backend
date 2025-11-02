import { categoryTable } from '../utils/prisma';

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
                throw new Error(
                    `${categoryInformation.categoryName} category already exists`
                );
            }

            const newCategory = await categoryTable.create({
                data: {
                    name: categoryInformation.categoryName,
                    description: categoryInformation.categoryDescription,
                    userId,
                },
            });
            console.log('Category created', newCategory);
            return newCategory;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    `the category with this name already exists for this user ${categoryInformation.categoryName}`
                );
            }
            if (error instanceof Error) {
                throw new Error('Email already exists');
            }
            throw new Error('Unknown error');
        }

        // if (userId == existingCategory.userId) {
    }
}
