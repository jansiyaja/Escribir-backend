"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUseCase = void 0;
const User_1 = require("../entities/User");
const customErrors_1 = require("../framework/errors/customErrors");
const stripe_1 = __importDefault(require("stripe"));
const client_s3_1 = require("@aws-sdk/client-s3");
const IAdvertisement_1 = require("../entities/IAdvertisement");
class ClientUseCase {
    constructor(_userRepository, _emailServices, _clientRepository, _addRepository, _s3) {
        this._userRepository = _userRepository;
        this._emailServices = _emailServices;
        this._clientRepository = _clientRepository;
        this._addRepository = _addRepository;
        this._s3 = _s3;
    }
    async makePayment(userId, email, businessName) {
        console.log("I am calling");
        const key = process.env.SECRETKEY;
        const stripe = new stripe_1.default(key);
        const priceId = "price_1QRTlnAQCNLhi0WMvz3KnrLJ";
        const amount = 300;
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
            success_url: `https://escribir-frontend.vercel.app/advertisement-payment-success?amount=${amount}&orderId={CHECKOUT_SESSION_ID}&customerEmail=${email}&businessName=${businessName}`,
            cancel_url: `https://escribir-frontend.vercel.app/paymentcancelled`,
            metadata: { userId },
        });
        return session.url || session.id;
    }
    async upadateData(userId, orderId, amount, email, businessName) {
        console.log(email);
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        await this._userRepository.updateUserDetails(userId, {
            role: User_1.UserRole.CLIENT,
        });
        const client = {
            userId: user._id,
            paymentId: orderId,
            paymentAmount: amount,
            businessName: businessName,
        };
        const createClient = await this._clientRepository.create(client);
        if (!process.env.MAIL_EMAIL) {
            throw new customErrors_1.BadRequestError("admin email is not getting");
        }
        await this._emailServices.sendEmail({
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: "Welcome to Escriber Advertisement Client",
            text: "Welcome to Escriber",
            html: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1>Thank You for Becoming an Escriber Advertisement Client!</h1>

      <p style="color: #333;">Dear Madam/Sir ,</p>
      
      <p>We are excited to inform you that we have successfully received the payment from your account. As a valued advertisement client, you now have access to exclusive features that will help your business grow!</p>

      <h2 style="color: #0066cc;">Explore Your New Features:</h2>

      <div style="margin-bottom: 20px;">
        <ul style="padding-left: 20px; list-style-type: none;">
          <li style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <HiOutlineLightBulb className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
              <div style="margin-left: 10px;">
                <h3 style="font-size: 18px; font-weight: bold;">Instant Campaigns</h3>
                <p style="font-size: 14px;">Set up and launch your ads in just minutes.</p>
              </div>
            </div>
          </li>
          <li style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <HiOutlineGlobeAlt className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
              <div style="margin-left: 10px;">
                <h3 style="font-size: 18px; font-weight: bold;">Global Reach</h3>
                <p style="font-size: 14px;">Reach audiences worldwide with precise targeting.</p>
              </div>
            </div>
          </li>
          <li style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <HiOutlinePlay className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
              <div style="margin-left: 10px;">
                <h3 style="font-size: 18px; font-weight: bold;">Engaging Formats</h3>
                <p style="font-size: 14px;">Choose from video, banners, or text ads.</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <p style="color: #0066cc; font-weight: bold;">We look forward to seeing your business grow through these powerful advertising tools!</p>

      <p style="font-size: 14px; color: #666;">Best regards,<br>The Escriber Team</p>
    </div>
  `,
        });
        return "complted sucessfully";
    }
    async uploadImageToS3(buffer, mimeType) {
        console.log("image uploader");
        const key = this.generateRandomKey();
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };
        console.log("image uploader PARAMS");
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            await this._s3.send(command);
            console.log("image  PARAMS");
            const image = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            console.log(image);
            return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            console.error("Error uploading image to S3:", error);
            throw new Error("Could not upload image to S3");
        }
    }
    generateRandomKey() {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    async uploadVideoToS3(buffer, mimeType) {
        console.log("video uploader");
        const key = this.generateRandomKey();
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };
        console.log("video uploader PARAMS");
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            await this._s3.send(command);
            console.log("video uploaded successfully");
            const videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            console.log(videoUrl);
            return videoUrl;
        }
        catch (error) {
            console.error("Error uploading video to S3:", error);
            throw new Error("Could not upload video to S3");
        }
    }
    async createAdvertisement(adDetails, imageKey, userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const contents = adDetails.contents?.length > 0
            ? adDetails.contents
            : [{ type: IAdvertisement_1.AdContent.IMAGE, value: imageKey }];
        const advertisement = {
            title: adDetails.title,
            targetAudience: adDetails.targetAudience,
            format: adDetails.format,
            industry: adDetails.industry,
            link: adDetails.link,
            contents,
            userId: user._id,
            status: "active",
        };
        const advertisementId = advertisement._id;
        await this._clientRepository.updateClientDetails(userId, {
            activeAds: 1,
            advertisements: advertisementId?.toString(),
        });
        const add = await this._addRepository.create(advertisement);
        return add;
    }
    async listAdd(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const ad = await this._addRepository.findAllAds();
        return ad;
    }
    async listAdUser(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const ad = await this._addRepository.findAllUserAds(user._id);
        return ad;
    }
    async pauseAd(adId, userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const AdData = await this._addRepository.findById(adId);
        if (!AdData) {
            throw new Error("Ad not found with this adId");
        }
        const newStatus = AdData.status === "active" ? "inactive" : "active";
        const updatedAd = await this._addRepository.update(adId, { status: newStatus });
        return updatedAd;
    }
}
exports.ClientUseCase = ClientUseCase;
