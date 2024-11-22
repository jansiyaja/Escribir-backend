
import { Request, Response } from "express";
import { IAdminController } from "../../interfaces/controllers/IAdminController";
import { IAdminUseCase } from "../../interfaces/usecases/IAdminUseCase";
import { HttpStatusCode } from "./httpEnums";
import { BadRequestError } from "../../framework/errors/customErrors";
import { logger } from "../../framework/services/logger";

export class AdminController implements IAdminController {

    constructor(private _adminUseCase: IAdminUseCase) {}

    async login(req: Request, res: Response): Promise<void> {


        try {
            const { email, password } = req.body;

            console.log(req.body);
            
                    if (!email || !password) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Email and password are required" });
            }

            const {  user,accessToken,refreshToken } = await this._adminUseCase.loginAdmin({ email, password });


           res.cookie("accessToken", accessToken, {
            httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
          });
          
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
            
             res.status(HttpStatusCode.OK).json({ user });
        } catch (error) {
            console.error("Login error:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }


    async logout(req: Request, res: Response): Promise<void> {
        try {

            res.clearCookie("accessToken", {
                httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              });
        
              res.clearCookie("refreshToken", {
                httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              });

                 
             res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });   
        } catch (error) {
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to log out" });
         
        }
    }
    async verifyToken(req: Request, res: Response): Promise<void> {
        console.log("iam inside the verify token");
        
        try {

            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing' });
            }
            const { accessToken } = await this._adminUseCase.verifyToken(refreshToken);
          
           res.cookie("accessToken",accessToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge:15*60*1000
           });

        
            
             res.status(HttpStatusCode.OK).json({ accessToken });
        } catch (error) {
             res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
    }
    async listUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this._adminUseCase.getAllUsers();
             res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            console.error("Error listing users:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    
    async blockUser(req: Request, res: Response): Promise<void> {
        console.log("iam here in the block user ",req.body);
        
        try {
            const { userId } = req.body;

            if (!userId) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }

            const blockedUser = await this._adminUseCase.blockUser(userId);

            if (!blockedUser) {
                 res.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }

             res.status(HttpStatusCode.OK).json({ message: "User blocked successfully", user: blockedUser });
        } catch (error) {
          
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to block user" });
        }
    }

    async unBlockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;

            if (!userId) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }
            const unblockedUser = await this._adminUseCase.unblockUser(userId);

            if (!unblockedUser) {
                 res.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }
             res.status(HttpStatusCode.OK).json({ message: "User blocked successfully", user: unblockedUser });
            
        } catch (error) {
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to unblock user" });  
        }
    }
   

    async createTag(req: Request, res: Response): Promise<void> {
        logger.info(req.body)
     try {
        const { name } = req.body;
       

        if(!name){
            throw new BadRequestError("tagName is Required")
        }
        const createdTag = await this._adminUseCase.createTag({ name: name });
         res.status(HttpStatusCode.CREATED).json({
            message: "Tag created successfully",
            tag: createdTag
        });
        
     } catch (error) {
        logger.error(error)
        if (error instanceof BadRequestError) {
             res.status(HttpStatusCode.BAD_REQUEST).json({ error: error.message });
        }
         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to create tag" });   
     }
    }

    async listTags(req: Request, res: Response): Promise<void> {
      
        try {
            const tag = await this._adminUseCase.getAllTags();
             res.status(HttpStatusCode.OK).json(tag);
        } catch (error) {
            logger.error("Error listing users:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list tags" });
        }
    }
    async updateTag(req: Request, res: Response): Promise<void> {
     
        
        const { tagId } = req.params;
        const { name } = req.body;
      
        try {
            const updatedTag = await this._adminUseCase.updateTags({ _id: tagId, name });
             res.status(HttpStatusCode.OK).json(updatedTag);
        } catch (error) {
            logger.error("Error updating tag:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update tag" });
        }
    }
    async deleteTag(req: Request, res: Response): Promise<void> {
        const { tagId } = req.params;
    
        try {
            const deletedTag = await this._adminUseCase.deleteTag(tagId);
             res.status(HttpStatusCode.OK).json(deletedTag);
        } catch (error) {
            logger.error("Error deleting tag:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete tag" });
        }
    }
    async listOfReports(req: Request, res: Response): Promise<void> {
      
        try {
            const reports = await this._adminUseCase.getAlReports();
             res.status(HttpStatusCode.OK).json(reports);
        } catch (error) {
            logger.error("Error listing users:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list Reporedblog" });
        }
    }
    
}
