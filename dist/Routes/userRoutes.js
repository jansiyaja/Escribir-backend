"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
const multerConfig_1 = require("../framework/config/multerConfig");
exports.userRouter = express_1.default.Router();
exports.userRouter.post('/register', (req, res) => dependencyResolver_1.userController.register(req, res));
exports.userRouter.post('/verify-otp', (req, res) => dependencyResolver_1.userController.verifyOTP(req, res));
exports.userRouter.post('/verify-token', tokenValidator_1.authenticateRefreshToken, (req, res) => dependencyResolver_1.userController.verifyToken(req, res));
exports.userRouter.post('/login', (req, res) => dependencyResolver_1.userController.login(req, res));
exports.userRouter.post('/resend-otp', (req, res) => dependencyResolver_1.userController.resendOTP(req, res));
exports.userRouter.post('/logout', (req, res) => dependencyResolver_1.userController.logout(req, res));
//-- after authentication------------------------------------------------------------------------------------------//
exports.userRouter.post('/profileImage', multerConfig_1.uploadProfileImage, tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.profileImageUpload(req, res));
exports.userRouter.post('/profile', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.updateProfile(req, res));
exports.userRouter.get('/profile', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.getProfile(req, res));
exports.userRouter.post('/feedback', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.feedback(req, res));
exports.userRouter.get('/connectionProfile/:autherId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.friendprofile(req, res));
exports.userRouter.post('/makePayment', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.makePayment(req, res));
exports.userRouter.post('/paymentUpdate', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.paymentSuccess(req, res));
exports.userRouter.get('/user-subscription', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.user_subscription(req, res));
exports.userRouter.post('/update-password', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.updatePassword(req, res));
exports.userRouter.get('/2fa_generate', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.generateqr(req, res));
exports.userRouter.post('/verify_2fa', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.verify2FA(req, res));
exports.userRouter.post('/disable_2fa', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.disable2FA(req, res));
exports.userRouter.post('/sendverificationEmail', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.sendingEmail(req, res));
exports.userRouter.post('/verification', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.verifyingOtp(req, res));
exports.userRouter.post('/account_delete', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.accountDelete(req, res));
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
exports.userRouter.get('/notifications', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.getAllNotifications(req, res));
exports.userRouter.post('/notificationSend', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.userController.sendNotifications(req, res));
