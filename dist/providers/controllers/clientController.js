"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const customErrors_1 = require("../../framework/errors/customErrors");
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
class ClientController {
    constructor(_clientUseCase) {
        this._clientUseCase = _clientUseCase;
    }
    async makePayment(req, res) {
        try {
            const { email, businessName } = req.body;
            const userId = req.user.userId;
            if (!email || !userId || !businessName) {
                throw new customErrors_1.BadRequestError("Plan and User ID are required.");
            }
            const sessionId = await this._clientUseCase.makePayment(userId, email, businessName);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(sessionId);
        }
        catch (error) {
            logger_1.logger.error("Error ", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async paymentSuccess(req, res) {
        console.log("iam here payment sucess page");
        try {
            const { amount, orderId, customerEmail, businessName } = req.body;
            console.log(req.body);
            const userId = req.user.userId;
            const paymentSuccess = await this._clientUseCase.upadateData(userId, orderId, amount, customerEmail, businessName);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(paymentSuccess);
        }
        catch (error) {
            logger_1.logger.error("Error in paymentSuccess:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async createAdd(req, res) {
        const { textContent, format, title, targetAudience } = req.body;
        const userId = req.user.userId;
        if (!title || !targetAudience || !format) {
            res.status(400).json({ message: 'Missing required fields: title, targetAudience, or format.' });
            return;
        }
        const imageBuffer = req.file?.mimetype?.startsWith('image/') ? req.file?.buffer : null;
        const videoBuffer = req.file?.mimetype?.startsWith('video/') ? req.file?.buffer : null;
        const videoMimeType = req.file?.mimetype;
        let mediaKey = '';
        try {
            // Validate required files based on the format
            if (format === 'Image Ad' && !imageBuffer) {
                res.status(400).json({ message: 'Image file is required for Image Ads.' });
                return;
            }
            if (format === 'Video Ad' && !videoBuffer) {
                res.status(400).json({ message: 'Video file is required for Video Ads.' });
                return;
            }
            // Upload the media to S3 based on format
            if (format === 'Image Ad' && imageBuffer) {
                mediaKey = await this._clientUseCase.uploadImageToS3(imageBuffer, userId);
            }
            else if (format === 'Video Ad' && videoBuffer) {
                mediaKey = await this._clientUseCase.uploadVideoToS3(videoBuffer, videoMimeType);
            }
            // Construct contents array
            const contents = [];
            if (textContent) {
                contents.push({ type: 'text', value: textContent });
            }
            if (format === 'Image Ad' && mediaKey) {
                contents.push({ type: 'image', value: mediaKey });
            }
            if (format === 'Video Ad' && mediaKey) {
                contents.push({ type: 'video', value: mediaKey });
            }
            // Ensure at least one valid content type exists
            if (contents.length === 0) {
                res.status(400).json({ message: 'At least one content type must be provided.' });
                return;
            }
            // Create the ad details
            const adDetails = { ...req.body, contents };
            const ad = await this._clientUseCase.createAdvertisement(adDetails, mediaKey, userId);
            res.status(201).json(ad);
        }
        catch (error) {
            logger_1.logger.error('Error creating advertisement:', error);
            res.status(500).send('Error creating advertisement');
        }
    }
    async listAd(req, res) {
        const userId = req.user.userId;
        if (!userId) {
            throw new customErrors_1.UnauthorizedError("Plan and User ID are required.");
        }
        try {
            const list_ad = await this._clientUseCase.listAdd(userId);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(list_ad);
        }
        catch (error) {
            logger_1.logger.error('Error listing advertisement:', error);
            res.status(500).send('Error listing advertisement');
        }
    }
    async listAdUser(req, res) {
        const userId = req.user.userId;
        if (!userId) {
            throw new customErrors_1.UnauthorizedError("Plan and User ID are required.");
        }
        try {
            const list_ad = await this._clientUseCase.listAdUser(userId);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(list_ad);
        }
        catch (error) {
            logger_1.logger.error('Error listing advertisement:', error);
            res.status(500).send('Error listing advertisement');
        }
    }
    async pauseAd(req, res) {
        const userId = req.user.userId;
        if (!userId) {
            throw new customErrors_1.UnauthorizedError("Plan and User ID are required.");
        }
        try {
            const { adId } = req.body;
            const pauseAd = await this._clientUseCase.pauseAd(adId, userId);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(pauseAd);
        }
        catch (error) {
            logger_1.logger.error('Error listing advertisement:', error);
            res.status(500).send('Error listing advertisement');
        }
    }
}
exports.ClientController = ClientController;
