"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienRoute = void 0;
const express_1 = __importDefault(require("express"));
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
const multerConfig_1 = require("../framework/config/multerConfig");
exports.clienRoute = express_1.default.Router();
exports.clienRoute.post('/makePayment', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['client']), (req, res) => dependencyResolver_1.clientController.makePayment(req, res));
exports.clienRoute.post('/paymentUpdate', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['client']), (req, res) => dependencyResolver_1.clientController.paymentSuccess(req, res));
exports.clienRoute.post('/createAdd', tokenValidator_1.authenticateToken, multerConfig_1.uploadAdd, (0, tokenValidator_1.checkRole)(['client']), (req, res) => dependencyResolver_1.clientController.createAdd(req, res));
exports.clienRoute.get('/listAdd', (req, res) => dependencyResolver_1.clientController.listAd(req, res));
exports.clienRoute.get('/listUserAdd', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['client']), (req, res) => dependencyResolver_1.clientController.listAdUser(req, res));
exports.clienRoute.post('/pauseAdd', tokenValidator_1.authenticateToken, (0, tokenValidator_1.checkRole)(['client']), (req, res) => dependencyResolver_1.clientController.pauseAd(req, res));
