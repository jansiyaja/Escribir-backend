"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoute = void 0;
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
exports.commentRoute = express_1.default.Router();
exports.commentRoute.post('/addComment/:id/', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.commentController.addComment(req, res));
exports.commentRoute.post('/reactComment/:commentId/', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.commentController.reactToComment(req, res));
exports.commentRoute.post('/replyComment/:commentId/', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.commentController.replyToComment(req, res));
