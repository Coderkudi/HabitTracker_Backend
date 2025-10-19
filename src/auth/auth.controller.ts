import { type Request, type Response, Router } from "express";
import { catchAsync } from "../utils/catchAsyncWrapper";
import { authManager } from "./auth.manager";


export class authController {
  public router = Router();
  private _authManager = new authManager();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post("/register", catchAsync(this.registerUser.bind(this)));
    this.router.get("/hello", catchAsync(this.hello.bind(this)));
  }

  public async hello(req: Request, res: Response) {
    return res.status(200).json({
      message: "Hello from the server",
    });
  }
  public async registerUser(req: Request, res: Response) {
    try{
      const {name, email, userName, password} = req.body;
      console.log(name, email, userName, password)
      const newUser = await this._authManager.registerUser({
        name, email, userName, password
      });

      return res.status(201).json({message: "Successfully registered", user: newUser});
    }
    catch(error: any)
    {
      if (error.message == "Email allready exists"){
        return res.status(400).json({message: error.message});

      }
      return res.status(500).json({message: error.message});
    }
  }
}
