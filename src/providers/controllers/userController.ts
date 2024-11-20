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

   async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;
            logger.info("Registering user: ", { username, email });

            if (!username || !email || !password) {
                throw new BadRequestError("All fields are required: username, email, and password");
            }

            const newUser = await this._userUseCase.registerUser({ email, password, username });

            res.status(HttpStatusCode.CREATED).json(newUser);
        } catch (error) {
            logger.error("Error during user registration:", error);
            if (error instanceof BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new InternalServerError("An unexpected error occurred").serializeError() });
        }
    }

    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            logger.info("Verifying OTP for email:", email);

            const { user, accessToken, refreshToken } = await this._userUseCase.verifyOTP({ otp, email });

          

            res.status(HttpStatusCode.OK).json({ user });
        } catch (error) {
            logger.error('OTP Verification Error:', error);
            if (error instanceof BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
        }
    }

    async resendOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            logger.info("Resending OTP for email:", email);

            await this._userUseCase.resendOTP({ email });
            res.status(HttpStatusCode.OK).json({ message: "OTP resent successfully" });
        } catch (error) {
            logger.error("Error resending OTP:", error);
            if (error instanceof InvalidTokenError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new InternalServerError("An unexpected error occurred").serializeError() });
        }
    }

    async verifyToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            logger.info("Verifying refresh token");

            if (!refreshToken) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing' });
                return;
            }

            const { accessToken } = await this._userUseCase.verifyToken(refreshToken);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
               secure: process.env.NODE_ENV !== "development",
                 sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(HttpStatusCode.OK).json({ accessToken, refreshToken });
        } catch (error) {
            logger.error("Error verifying token:", error);
            res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            logger.info("Logging out user");

            res.clearCookie("accessToken", {
                httpOnly: true,
              secure: process.env.NODE_ENV !== "development",
                 sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                 sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            });

            res.status(HttpStatusCode.OK).json({ message: "Logged out successfully" });
        } catch (error) {
            logger.error("Error during logout:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to log out" });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            logger.info("Logging in user:", { email });

            if (!email || !password) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ error: "All fields are required: email and password" });
                return;
            }

            const { user, accessToken, refreshToken } = await this._userUseCase.loginUser({ email, password });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
               secure: process.env.NODE_ENV !== "development",
                 sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatusCode.OK).json({ user });
        } catch (error) {
            logger.error("Error during login:", error);
            res.status(HttpStatusCode.UNAUTHORIZED).json({ error });
        }
    }

    async profileImageUpload(req: Request, res: Response): Promise<void> {
        try {
            logger.info("Uploading profile image");

            const userId = (req as any).user.userId;
            if (!userId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const imageBuffer = req.file?.buffer;
            if (!imageBuffer) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No image file provided' });
                return;
            }

            const secureUrl = await this._userUseCase.saveProfileImage(imageBuffer, userId);
            res.status(HttpStatusCode.OK).json({ secureUrl });
        } catch (error) {
            logger.error("Error uploading profile image:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to upload profile image' });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            logger.info("Updating user profile");

            const userId = (req as any).user.userId;
            if (!userId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const profileData = req.body;
            const result = await this._userUseCase.updateProfile(userId, profileData);

            res.status(HttpStatusCode.OK).json({
                message: 'Profile updated successfully',
                user: result.user
            });
        } catch (error) {
            logger.error("Error updating profile:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update profile' });
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            logger.info("Fetching user profile");

            const userId = (req as any).user.userId;
            if (!userId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const users = await this._userUseCase.getProfile(userId);
            res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            logger.error("Error fetching user profile:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }

    async friendprofile(req: Request, res: Response): Promise<void> {
        try {
            const { autherId } = req.params;
            logger.info("Fetching friend profile for ID:", autherId);

            if (!autherId) {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }

            const users = await this._userUseCase.getProfile(autherId);
            res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            logger.error("Error fetching friend profile:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async getAllNotifications(req: Request, res: Response): Promise<void> {
        try {


            const userId = (req as any).user.userId;
            const notifications = await this._userUseCase.getAllNotifications(userId);

            res.status(HttpStatusCode.OK).json({ notifications });
        } catch (error) {
            logger.error("Error fetching notifications:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }

    async sendNotifications(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const { followerId } = req.body;


            const notification = await this._userUseCase.sendNotifications(followerId, userId);


            res.status(HttpStatusCode.OK).json({ notification });
        } catch (error) {
            logger.error("Error sending notifications:", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }




    async feedback(req: Request, res: Response): Promise<void> {
        try {
             const { name, email, message } = req.body;
        console.log(name,email,message);
            
          if (!name || !email || !message) {
                throw new BadRequestError("All fields are required: name, email, and message");
            }

            const newUser = await this._userUseCase.sendFeedbackEmail(name,email,message)
           res.status(HttpStatusCode.CREATED).json(newUser)
        } catch (error) {


            if (error instanceof BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
                
            }

            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new InternalServerError("An unexpected error occurred").serializeError() });

        }
       
        
    }
 
}