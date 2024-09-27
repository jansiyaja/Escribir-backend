
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



              // Set access and refresh tokens in cookies
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
    
}
