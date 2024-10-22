import { Request, Response } from "express";
import { IUserController } from "../../interfaces/controllers/IUserController";
import { IUserUseCase } from "../../interfaces/usecases/IUserUseCase";
import { BadRequestError, InternalServerError, InvalidTokenError } from "../../framework/errors/customErrors";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";

export class UserController implements IUserController {
    constructor(
        private _userUseCase: IUserUseCase,

    ) { }

    async register(req: Request, res: Response): Promise<void>  {
        try {

          const { username, email, password } = req.body;


            if (!username || !email || !password) {
                throw new BadRequestError("All fields are required: username, email, and password");
            }

            const newUser = await this._userUseCase.registerUser({ email, password, username })

            res.status(HttpStatusCode.CREATED).json(newUser)
        } catch (error) {


            if (error instanceof BadRequestError) {
             res.status(error.statusCode).json({ error: error.message });
            }

             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new InternalServerError("An unexpected error occurred").serializeError() });

        }
    }

        async verifyOTP(req: Request, res: Response):  Promise<void>  {
        try {
            const { email, otp } = req.body;
            const { user, accessToken, refreshToken } = await this._userUseCase.verifyOTP({ otp, email });

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

             res.status(HttpStatusCode.OK).json({ user, });
        } catch (error) {
            if (error instanceof BadRequestError) {
                 res.status(error.statusCode).json({ error: error.message });
            }
            logger.error('OTP Verification Error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
        }
    }
    async resendOTP(req: Request, res: Response):  Promise<void>  {

        logger.info("resent otp  controller")
        try {
            const { email } = req.body;


            await this._userUseCase.resendOTP({ email });
            res.status(HttpStatusCode.OK).json({ message: "OTP resent successfully" });
        } catch (error) {

            if (error instanceof InvalidTokenError) {
                 res.status(error.statusCode).json({ error: error.message });
            }
            logger.error("Internal Server Error:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new InternalServerError("An unexpected error occurred").serializeError() });
        }
    }
      async verifyToken(req: Request, res: Response):  Promise<void> {
        

        try {

            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing' });
            }
            const { accessToken } = await this._userUseCase.verifyToken(refreshToken);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });



            res.status(HttpStatusCode.OK).json({ accessToken });
        } catch (error) {
           res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
    }

    async logout(req: Request, res: Response):Promise<void> {
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


             res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
        } catch (error) {
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to log out" });

        }
    }
        async login(req: Request, res: Response): Promise<void> {

        try {


            logger.info("inside the login")
            const { email, password } = req.body;

            if (!email || !password) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "All fields are required: username, email, and password" });
            }

            const { user, accessToken, refreshToken } = await this._userUseCase.loginUser({ email, password });


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


             res.status(HttpStatusCode.OK).json({ user });

        } catch (error) {

            res.status(HttpStatusCode.UNAUTHORIZED).json({ error });
        }
    }

    async profileImageUpload(req: Request, res: Response): Promise<void> {
        logger.info("inside the profile image controller")

        try {

            const userId = (req as any).user.userId;

            if (!userId) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }


            const imageBuffer = req.file?.buffer;


            if (!imageBuffer) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No image file provided' });
                return
            }

            const secureUrl = await this._userUseCase.saveProfileImage(imageBuffer, userId);
           
            

             res.status(HttpStatusCode.OK).json({ secureUrl });



        } catch (error) {

             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to upload profile image' });

        }
    }

    async updateProfile(req: Request, res: Response):Promise<void> {
        try {
            const userId = (req as any).user.userId;

            if (!userId) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const profileData = req.body

            const result = await this._userUseCase.updateProfile(userId, profileData);

             res.status(HttpStatusCode.OK).json({
                message: 'Profile updated successfully',
                user: result.user
            });

        } catch (error) {
            logger.error('Error updating profile:', error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to update profile',

            });
        }
    }
    async getProfile(req: Request, res: Response): Promise<void> {

        try {
            const userId = (req as any).user.userId;

            if (!userId) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const users = await this._userUseCase.getProfile(userId);
             res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            logger.error("Error listing users:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
}