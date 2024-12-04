import Stripe from "stripe";
import { INotification } from "../entities/INotification";
import { IUser } from "../entities/User";
import { cloudinary } from "../framework/config/cloudinaryConfig";
import {
  BadRequestError,
  InternalServerError,
  InvalidTokenError,
  NotFoundError,
} from "../framework/errors/customErrors";

import { HashService } from "../framework/services/hashService";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../framework/services/jwtService";
import { logger } from "../framework/services/logger";

import { IEmailService } from "../interfaces/repositories/IEmailRepository";

import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { IOTPVerificationRepository } from "../interfaces/repositories/IOTPVerificationRepository";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { IUserUseCase } from "../interfaces/usecases/IUserUseCase";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ISubscription } from "../entities/ISubscription";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export class UserUseCase implements IUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _hashService: HashService,
    private _emailServices: IEmailService,
    private _otpRepository: IOTPVerificationRepository,
    private _notificationRepo: INotificationRepository
  ) { }

  async registerUser(userData: Partial<IUser>): Promise<{ user: IUser }> {
    logger.info("checking existing user");

    const existingUser = await this._userRepository.findByEmail(
      userData.email!
    );

    if (existingUser) {
      throw new BadRequestError("User with email already exists");
    }

    const hashedPassword = await this._hashService.hash(userData.password!);
    const otp = crypto.randomInt(1000, 9999).toString();
    console.log(otp);

    const newUser: IUser = {
      ...userData,
      password: hashedPassword,
      isVerified: false,
    } as IUser;

    const createUser = await this._userRepository.create(newUser);

    if (!createUser.email) {
      throw new Error("Failed to create user: Email is null");
    }

    const newOtp = { otp: otp, email: createUser.email };
    await this._otpRepository.create(newOtp);
    if (!process.env.MAIL_EMAIL) {
      throw new BadRequestError("admin email is not getting");
    }

    await this._emailServices.sendEmail({
      from: process.env.MAIL_EMAIL,
      to: userData.email!,
      subject: "Welcome To Escriber, Our Blog Platform!",
      text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`,
    });

    return {
      user: createUser,
    };
  }

  async verifyOTP({
    otp,
    email,
  }: {
    otp: string;
    email: string;
  }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    logger.info("Verifying OTP for email", { email });

    const otpVerification = await this._otpRepository.findByUserByEmail(email);
    if (!otpVerification) {
      throw new BadRequestError("No OTP record found for this email");
    }

    const otpCreatedAt = otpVerification.createdAt;
    if (!otpCreatedAt) {
      throw new InternalServerError("OTP creation time is missing");
    }

    const currentTime = new Date();
    const hourDifference =
      (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60 * 60);
    if (hourDifference > 1) {
      await this._userRepository.delete(email);
      throw new BadRequestError("OTP expired and user deleted");
    }

    if (otpVerification.otp !== otp) {
      throw new BadRequestError("Invalid OTP provided");
    }

    await this._userRepository.markAsVerified(email);
    await this._otpRepository.deleteByUserId(email);

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new InternalServerError("User not found");
    }
    const userRole = user.role;
    const accessToken = generateAccessToken(user._id, userRole);
    const refreshToken = generateRefreshToken(user._id, userRole);

    return { user, accessToken, refreshToken };
  }

  async resendOTP({ email }: { email: string }): Promise<void> {
    const otp = crypto.randomInt(1000, 9999).toString();

    console.log("new OTP", otp);
    console.log("new Email", email);

    await this._otpRepository.updateOtp(email, otp);

    const userData = await this._userRepository.findByEmail(email);
    console.log(userData, "user");

    if (!userData) {
      throw new InvalidTokenError("There is no user  with this email");
    }
    if (!process.env.MAIL_EMAIL) {
      throw new BadRequestError("admin email is not getting");
    }

    await this._emailServices.sendEmail({
      from: process.env.MAIL_EMAIL,
      to: userData.email!,
      subject: "Welcome To Escriber, Our Blog Platform!",
      text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`,
    });
  }

  async verifyToken(token: string): Promise<{ accessToken: string }> {
    try {
      logger.info("Starting token verification");

      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as { userId: string };

      const user = await this._userRepository.findById(decoded.userId);

      if (!user || !user._id) {
        logger.error("User not found or user ID is missing");
        throw new Error("User not found or user ID is missing");
      }
      const userRole = user.role;
      const accessToken = generateAccessToken(user._id, userRole);

      logger.info("Token verification successful, returning new tokens");

      return {
        accessToken,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.error("Token has expired");
        throw new Error("Refresh token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.error("Invalid token");
        throw new Error("Invalid refresh token");
      } else {
        logger.error("Error verifying token:", error);
        throw new Error("Token verification failed");
      }
    }
  }

  async loginUser(
    userData: Partial<IUser>
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const existingUser = await this._userRepository.findByEmail(
      userData.email!
    );

    if (!existingUser) {
      throw new Error("User with email does not exist");
    }

    if (existingUser.isBlock) {
      throw new Error("User is blocked by admin");
    }
    const isMatch = await this._hashService.compare(
      userData.password!,
      existingUser.password!
    );

    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const userRole = existingUser.role;
    const userId = existingUser._id;
    if (!userId) {
      throw new Error("User ID is missing");
    }
    const accessToken = generateAccessToken(userId, userRole);
    const refreshToken = generateRefreshToken(userId, userRole);

    return {
      user: existingUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async saveProfileImage(imageBuffer: Buffer, userId: string): Promise<string> {
    try {
      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      let existingImageUrl = user.image;

      let existingImageId = null;

      if (existingImageUrl) {
        const existingImageParts = existingImageUrl.split("/");
        existingImageId =
          existingImageParts[existingImageParts.length - 1].split(".")[0];
      }

      if (existingImageId) {
        try {
          await cloudinary.uploader.destroy(existingImageId);
        } catch (error) {
          logger.error("Error deleting existing image from Cloudinary:", error);
        }
      }

      if (!(imageBuffer instanceof Buffer)) {
        throw new Error("Invalid image buffer");
      }

      const newImageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "Escribir_Profile_Images" },
          (error, result) => {
            if (error) {
              logger.error("Cloudinary upload error:", error);
              return reject(new Error("Cloudinary upload failed"));
            }
            if (result && result.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(
                new Error("Failed to get secure URL from Cloudinary response")
              );
            }
          }
        );

        uploadStream.end(imageBuffer);
      });

      try {
        await this._userRepository.updateUserDetails(userId, {
          image: newImageUrl,
        });
      } catch (dbError) {
        logger.error("Database update error:", dbError);
        throw new Error("Failed to update user image in database");
      }

      return newImageUrl;
    } catch (error) {
      logger.info("Error in uploading profile image", error);
      throw new Error("Failed to upload profile image");
    }
  }

  async updateProfile(
    userId: string,
    profileData: Partial<IUser>
  ): Promise<{ user: IUser }> {
    try {
      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUserData = {
        ...user,
        ...profileData,
      };

      await this._userRepository.updateUserDetails(userId, updatedUserData);
      const updatedUser = await this._userRepository.findById(userId);

      if (!updatedUser) {
        throw new Error("User is not updated");
      }

      return { user: updatedUser };
    } catch (error) {
      logger.error("Error updating user profile", error);
      throw new Error("Failed to update user profile");
    }
  }

  async getProfile(userId: string): Promise<{ user: IUser }> {
    console.log("id", userId);

    try {
      const user = await this._userRepository.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return { user };
    } catch (error) {
      logger.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  async sendFeedbackEmail(
    name: string,
    email: string,
    message: string
  ): Promise<string> {
    if (!process.env.MAIL_EMAIL) {
      throw new BadRequestError("admin email is not getting");
    }

    await this._emailServices.sendEmail({
      from: email,
      to: process.env.MAIL_EMAIL,
      subject: "Feed back From User",
      text: `Hi, iam ${name},  ${message}`,
    });

    return "sending email successfully";
  }

  async makePayment(
    plan: string,
    userId: string,
    email: string
  ): Promise<string> {
    console.log("iam callaing");

    const key = process.env.SECRETKEY;

    const stripe = new Stripe(key!);

    const priceMapping: Record<string, { id: string; amount: number }> = {
      monthly: { id: "price_1QPW8BAQCNLhi0WMzi5InXwT", amount: 10 },
      yearly: { id: "price_1QPW8BAQCNLhi0WMeTD6XQyF", amount: 100 },
    };
    const selectedPlan = priceMapping[plan];
    if (!selectedPlan) {
      throw new Error("Invalid plan selected.");
    }

    const { id: priceId, amount } = selectedPlan;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `http://localhost:5000/payment-success?amount=${amount}&orderId={CHECKOUT_SESSION_ID}&customerEmail=${email}`,
      cancel_url: `http://localhost:5000/paymentcancelled`,
      metadata: { userId },
    });

    return session.url || session.id;
  }

  async upadateData(
    plan: string,
    userId: string,
    orderId: string,
    amount: number,
    email: string
  ): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const startDate = new Date();
    const lastPaymentDate = startDate;
    let endDate: Date;
    if (plan === "monthly") {
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (plan === "yearly") {
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      throw new Error("Invalid plan selected");
    }
    const subscription = await this._userRepository.addSubscription(
      userId,
      plan,
      "active",
      amount,
      startDate,
      endDate,
      lastPaymentDate,
      orderId
    );
    const subscriptionId = subscription._id;

    await this._userRepository.updateUserDetails(userId, {
      subscriptionId: subscriptionId.toString(),
      isPremium: true,
    });

    if (!process.env.MAIL_EMAIL) {
      throw new BadRequestError("admin email is not getting");
    }

    await this._emailServices.sendEmail({
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: "Welcome to Escriber Premium Membership",
      html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Welcome to Escriber Premium Membership</h1>
      
      <p style="color: #333;">Dear Madam/Sir ,</p>
      
      <p>We are thrilled to welcome you as a new premium member of Escriber! Enjoy your upgraded experience:</p>
      
      <ul style="padding-left: 20px;">
        <li>Ad-free blog experience</li>
        <li>Premium customer support</li>
        <li>Enhanced connection via calls</li>
      </ul>
      
      <p style="color: #0066cc; font-weight: bold;">Thank you for choosing Escriber Premium!</p>
      
      <p style="font-size: 14px; color: #666;">Best regards,<br>The Escriber Team</p>
    </div>
  `,
    });

    return "complted sucessfully";
  }

  async suscribeUser(userId: string): Promise<ISubscription | null> {
    const suscribeUser = await this._userRepository.findSubscriptionByUserId(
      userId
    );

    return suscribeUser;
  }

  async passwordUpdate(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await this._hashService.compare(
      currentPassword!,
      user.password!
    );

    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await this._hashService.hash(newPassword!);
    await this._userRepository.updateUserDetails(userId, {
      password: hashedPassword,
    });
    return "password updated correctly";
  }

  async generate2FA(
    userId: string
  ): Promise<{
    secret: string;
    otpauth_url: string;
    qrCodeUrl: string | undefined;
  }> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const secret = speakeasy.generateSecret({
      name: `escribir(${userId})`,
      length: 20,
    });

    await this._userRepository.updateUserDetails(userId, {
      twoFactorSecret: secret.base32,
    });
    const otpauth_url = secret.otpauth_url;
    if (!otpauth_url) {
      throw new Error("Invalid otpauth_url");
    }

    const qrCodeUrl = await QRCode.toDataURL(otpauth_url);
    return { secret: secret.base32, qrCodeUrl, otpauth_url };
  }

  async verify2FA(userId: string, token: string): Promise<string> {
    const user = await this._userRepository.findById(userId);

    if (!user || !user.twoFactorSecret) {
      throw new Error("User not found or 2FA not set up");
    }
    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });
    if (isVerified) {
      await this._userRepository.updateUserDetails(userId, {
        twoFactorEnabled: true,
      });
    }
    return "2FA verification successful";
  }
  async disable2FA(userId: string): Promise<string> {
    const user = await this._userRepository.findById(userId);

    if (!user || !user.twoFactorSecret) {
      throw new Error("User not found or 2FA not set up");
    }
    await this._userRepository.updateUserDetails(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: " ",
    });
    return "Two-Factor Authentication has been disabled successfully.";
  }

  async sendingEmail(userId: string): Promise<string> {

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    console.log(otp);
    const email = user.email
    if (!email) throw new Error("User email found");

    const newOtp = { otp: otp, email: email };
    await this._otpRepository.create(newOtp);

    if (!process.env.MAIL_EMAIL) {
      throw new BadRequestError("admin email is not getting");
    }

    await this._emailServices.sendEmail({
      from: process.env.MAIL_EMAIL,
      to: user.email!,
      subject: "Welcome To Escriber, Our Blog Platform!",
      text: `Hi ${user.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`,
    });
    return "otp sended successfully"
  }
  async verifyingOtp(userId: string, otp: string): Promise<string> {

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const email = user.email
    if (!email) throw new Error("User email not found");

    logger.info("Verifying OTP for email", { email });

    const otpVerification = await this._otpRepository.findByUserByEmail(email);
    if (!otpVerification) {
      throw new BadRequestError("No OTP record found for this email");
    }

    const otpCreatedAt = otpVerification.createdAt;
    if (!otpCreatedAt) {
      throw new InternalServerError("OTP creation time is missing");
    }

    const currentTime = new Date();
    const hourDifference = (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60 * 60);
    if (hourDifference > 1) {

      throw new BadRequestError("OTP expired. Please request a new OTP.");
    }
    console.log("otpVerification", otpVerification.otp);
    console.log("entered", otp);



    if (otpVerification.otp !== otp) {
      throw new BadRequestError("Invalid OTP provided");
    }


    await this._otpRepository.deleteByUserId(email);





    return "verified";


  }
  async accountDelete(userId: string): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await this._userRepository.delete(userId);
    console.log("deleted");
    return "user delated successfully"

  }

  //-------------------------------------------------------------------------------------------------------------------------------------------//

  async getAllNotifications(userId: string): Promise<INotification[]> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const notifications = await this._notificationRepo.getNotifications(userId);

    return notifications;
  }
  async sendNotifications(followerId: string, userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const follower = await this._userRepository.findById(followerId);
    if (!follower) {
      throw new NotFoundError("Follower not found");
    }

    const notificationForSender = await this._notificationRepo.sendNotification(
      followerId,
      userId,
      `You are now following ${user.username}`
    );
    const notificationForReceiver =
      await this._notificationRepo.sendNotification(
        userId,
        followerId,
        `${follower.username} is now following you`
      );
    return;
  }
}
