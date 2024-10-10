
import { Request, Response } from "express";
import { IAdminController } from "../../interfaces/controllers/IAdminController";
import { IAdminUseCase } from "../../interfaces/usecases/IAdminUseCase";
import { HttpStatusCode } from "./httpEnums";
import { BadRequestError } from "../../framework/errors/customErrors";
import { logger } from "../../framework/services/logger";

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
    async verifyToken(req: Request, res: Response): Promise<Response> {
        console.log("iam inside the verify token");
        
        try {

            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing' });
            }
            const { accessToken } = await this._adminUseCase.verifyToken(refreshToken);
          
           res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:15*60*1000
           });

        
            
            return res.status(HttpStatusCode.OK).json({ accessToken });
        } catch (error) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid refresh token" });
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
   

    async createTag(req: Request, res: Response): Promise<Response> {
        logger.info(req.body)
     try {
        const { name } = req.body;
       

        if(!name){
            throw new BadRequestError("tagName is Required")
        }
        const createdTag = await this._adminUseCase.createTag({ name: name });
        return res.status(HttpStatusCode.CREATED).json({
            message: "Tag created successfully",
            tag: createdTag
        });
        
     } catch (error) {
        logger.error(error)
        if (error instanceof BadRequestError) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        }
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to create tag" });   
     }
    }

    async listTags(req: Request, res: Response): Promise<Response> {
      
        try {
            const tag = await this._adminUseCase.getAllTags();
            return res.status(HttpStatusCode.OK).json(tag);
        } catch (error) {
            logger.error("Error listing users:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async updateTag(req: Request, res: Response): Promise<Response> {
     
        
        const { tagId } = req.params;
        const { name } = req.body;
      
        try {
            const updatedTag = await this._adminUseCase.updateTags({ _id: tagId, name });
            return res.status(HttpStatusCode.OK).json(updatedTag);
        } catch (error) {
            logger.error("Error updating tag:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update tag" });
        }
    }
    async deleteTag(req: Request, res: Response): Promise<Response> {
        const { tagId } = req.params;
    
        try {
            const deletedTag = await this._adminUseCase.deleteTag(tagId);
            return res.status(HttpStatusCode.OK).json(deletedTag);
        } catch (error) {
            logger.error("Error deleting tag:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete tag" });
        }
    }
    
}
