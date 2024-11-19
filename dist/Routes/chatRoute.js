"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoute = void 0;
const express_1 = __importDefault(require("express"));
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
exports.chatRoute = express_1.default.Router();
exports.chatRoute.post('/newChat/:recieverId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.createChat(req, res));
exports.chatRoute.post('/messages/:chatId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.sendMessage(req, res));
exports.chatRoute.get('/messages/:chatId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.getMessagesByChatId(req, res));
exports.chatRoute.get('/interacted', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.interactedUsers(req, res));
exports.chatRoute.post('/groupscreate', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.createGroup(req, res));
exports.chatRoute.get('/groups', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.chatController.listGroup(req, res));
