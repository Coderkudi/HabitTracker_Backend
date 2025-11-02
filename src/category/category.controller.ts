import { type Request, type Response, Router } from 'express';
import verifyUser from '../middlewares/auth/jwtValidation';
import { catchAsync } from '../utils/catchAsyncWrapper';
import { categoryManager } from './category.manager';

export class categoryController {
    public router = Router();
    private _categoryManager = new categoryManager();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(
            '/helloworld',
            // verifyUser,
            catchAsync(this.helloworld.bind(this))
        );
        this.router.post(
            '/',
            verifyUser,
            catchAsync(this.createCategory.bind(this))
        );
        this.router.get(
            '/',
            verifyUser,
            catchAsync(this.getcategory.bind(this))
        );
    }

    public async helloworld(req: Request, res: Response) {
        return res.status(200).json({
            message: 'Hello from the server (category)',
        });
    }

    public async getcategory(req: Request, res: Response) {
        try {
            const userInformation = req.userInformation;
            if (userInformation) {
                const categories =
                    await this._categoryManager.categories(userInformation);
                if (categories) {
                    return res.status(200).json(categories);
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            return res
                .status(500)
                .json({ message: 'Failed to fetch categories' });
        }
    }

    public async createCategory(req: Request, res: Response) {
        try {
            const userInformation = req.userInformation;
            const { categoryName, categoryDescription } = req.body;
            console.log(categoryName, categoryDescription);
            const newCategory = await this._categoryManager.createCategory(
                { categoryName, categoryDescription },
                userInformation?.id || ''
            );
            return res.status(201).json({
                message: 'Successfully created the category',
                data: newCategory,
            });
        } catch (error) {
            return res.status(500).json({ message: (error as Error).message });
        }
    }
}
