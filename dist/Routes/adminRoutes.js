"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const dependencyResolver_1 = require("../framework/utils/dependencyResolver");
const tokenValidator_1 = require("../framework/middleWares/tokenValidator");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.get("/test", (req, res) => {
    res.send({ message: "uccesfully hosted" });
});
//---------------------UserRouteHandle---------------------------------------------------------------------------------------------------------------------------//
exports.adminRouter.post('/login', (req, res) => dependencyResolver_1.adminController.login(req, res));
exports.adminRouter.post('/logout', (req, res) => dependencyResolver_1.adminController.logout(req, res));
exports.adminRouter.post('/verify-token', tokenValidator_1.authenticateAdminToken, (req, res) => dependencyResolver_1.adminController.verifyToken(req, res));
exports.adminRouter.get('/users', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.listUsers(req, res));
exports.adminRouter.post('/blockUser', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.blockUser(req, res));
exports.adminRouter.post('/unblockUser', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.unBlockUser(req, res));
//------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------TagRouteHandel--------------------------------------------------------------------------------------------------------------------------//
exports.adminRouter.post('/createtags', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.createTag(req, res));
exports.adminRouter.get('/list-tags', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.listTags(req, res));
exports.adminRouter.put('/update-tag/:tagId', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.updateTag(req, res));
exports.adminRouter.delete('/delete-tag/:tagId', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.deleteTag(req, res));
//------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------------//
exports.adminRouter.get('/list-reportedBlog', tokenValidator_1.authenticateToken, (req, res) => dependencyResolver_1.adminController.listOfReports(req, res));
//------------------------------------------------------------------------------------------------------------------------------------------------//
