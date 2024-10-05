
import { Request, Response } from "express";
import { IAdminController } from "../../interfaces/controllers/IAdminController";
import { IAdminUseCase } from "../../interfaces/usecases/IAdminUseCase";
import { HttpStatusCode } from "./httpEnums";

export class AdminController implements IAdminController {
    constructor(private _adminUseCase: IAdminUseCase) {}

    async login(req: Request, res: Response): Promise<Response> {


        try {
            const { email, password } = req.body;

            console.log(req.body);
            
                    if (!email || !password) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Email and password are required" });
            }

            const {  user,accessToken,refreshToken } = await this._adminUseCase.loginAdmin({ email, password });


           res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });
          
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
            
            return res.status(HttpStatusCode.OK).json({ user });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }


    async logout(req: Request, res: Response): Promise<Response> {
        try {

            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });
        
              res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });

                 
            return res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });   
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to log out" });
         
        }
    }

    async listUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this._adminUseCase.getAllUsers();
            return res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            console.error("Error listing users:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    
    async blockUser(req: Request, res: Response): Promise<Response> {
        console.log("iam here in the block user ",req.body);
        
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }

            const blockedUser = await this._adminUseCase.blockUser(userId);

            if (!blockedUser) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }

            return res.status(HttpStatusCode.OK).json({ message: "User blocked successfully", user: blockedUser });
        } catch (error) {
          
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to block user" });
        }
    }

    async unBlockUser(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }
            const unblockedUser = await this._adminUseCase.unblockUser(userId);

            if (!unblockedUser) {
                return res.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }
            return res.status(HttpStatusCode.OK).json({ message: "User blocked successfully", user: unblockedUser });
            
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock user" });  
        }
    }
    
}
