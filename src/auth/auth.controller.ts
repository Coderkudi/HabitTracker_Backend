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
    this.router.post("/signup", catchAsync(this.registerUser.bind(this)));
    this.router.get("/hello", catchAsync(this.hello.bind(this)));
  }

  public async hello(req: Request, res: Response) {
    return res.status(200).json({
      message: "Hello from the server",
    });
  }
  public async registerUser(req: Request, res: Response) {
    const { registerUser } = req.body;

    const newUser = await this._authManager.registerUser(registerUser);

    if (newUser) {
      return res.status(200).json({ message: "Successfully registered" });
    } else if (newUser == "Invalid email") {
      return res.status(500).json({ message: "Unique Email require" });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  }
}
