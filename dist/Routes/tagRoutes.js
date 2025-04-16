"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRoute = void 0;
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
exports.tagRoute = express_1.default.Router();
exports.tagRoute.get('/tags', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.tagController.listTags(req, res));
exports.tagRoute.get('/trendtags', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.tagController.trendTags(req, res));
exports.tagRoute.get('/tagBlog/:tag', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['user', 'client']), (req, res) => dependencyResolver_1.tagController.TagByBlogs(req, res));
