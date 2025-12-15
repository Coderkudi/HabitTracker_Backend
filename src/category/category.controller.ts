import { type Request, type Response, Router } from 'express';
import verifyUser from '../middlewares/auth/jwtValidation.js';
import { handleError } from '../utils/apiError.js';
import { catchAsync } from '../utils/catchAsyncWrapper.js';
import { categoryManager } from './category.manager.js';

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
                    console.log('categories getted: ', categories);
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
        console.log('Incomming data', req.body);
        try {
            const userInformation = req.userInformation;
            const { categoryName, categoryDescription, categoryIcon } =
                req.body;
            console.log(
                'categoryName:',
                categoryName,
                'Category Description',
                categoryDescription
            );
            // if (!categoryName || categoryName.trim() === '') {
            // return res
            //     .status(400)
            //     .json({ message: 'Enter a category name' });
            // }
            const newCategory = await this._categoryManager.createCategory(
                { categoryName, categoryDescription, categoryIcon },
                userInformation?.id || ''
            );
            return res.status(201).json({
                message: 'Successfully created the category',
                data: newCategory,
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}
