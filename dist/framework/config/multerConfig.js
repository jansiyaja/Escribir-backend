"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdd = exports.uploadBlogImage = exports.uploadBlogData = exports.uploadProfileImage = void 0;
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
exports.uploadProfileImage = upload.single('profileImage');
exports.uploadBlogData = upload.single('coverImage');
exports.uploadBlogImage = upload.single('BlogImage');
exports.uploadAdd = upload.single('thumbnail');
