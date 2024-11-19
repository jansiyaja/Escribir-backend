"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialRoute = void 0;
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
exports.socialRoute = express_1.default.Router();
exports.socialRoute.get('/followStatus/:followingId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.followStatus(req, res));
exports.socialRoute.post('/follow/:followingId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.followUser(req, res));
exports.socialRoute.post('/unfollow/:followingId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.unfollowUser(req, res));
exports.socialRoute.post('/followAccept/:followingId/', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.followAccept(req, res));
exports.socialRoute.get('/getFollowers', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.getFollowers(req, res));
exports.socialRoute.get('/follows/search', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.socialController.searchUser(req, res));
