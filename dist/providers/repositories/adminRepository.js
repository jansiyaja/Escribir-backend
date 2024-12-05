"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_1 = __importDefault(require("../../framework/models/admin"));
const user_1 = __importDefault(require("../../framework/models/user"));
const tag_1 = __importDefault(require("../../framework/models/tag"));
const report_1 = __importDefault(require("../../framework/models/report"));
const blog_1 = __importDefault(require("../../framework/models/blog"));
const client_1 = __importDefault(require("../../framework/models/client"));
class AdminRepository {
    async findByEmail(email) {
        return await admin_1.default.findOne({ email }).lean().exec();
    }
    async saveAdmin(adminData) {
        const existingAdmin = await admin_1.default.findOne().lean().exec();
        if (existingAdmin) {
            throw new Error("An admin already exists.");
        }
        const newAdmin = new admin_1.default(adminData);
        return await newAdmin.save();
    }
    async findById(id) {
        return await admin_1.default.findById(id).exec();
    }
    async getAllUsers() {
        return await user_1.default.find().populate('subscriptionId').exec();
    }
    // ------------------Relatd to tag----------------------------------------------------//
    async findOne(name) {
        return await tag_1.default.findOne({ name });
    }
    async create(tagData) {
        const newTag = new tag_1.default(tagData);
        return await newTag.save();
    }
    async findAll() {
        return await tag_1.default.find().sort({ createdAt: -1 });
    }
    async updateTagById(tagId, tagData) {
        const updatedTag = await tag_1.default.findByIdAndUpdate(tagId, { $set: tagData }, { new: true });
        if (!updatedTag) {
            throw new Error("Tag not found");
        }
        return updatedTag;
    }
    async deleteTagById(tagId) {
        const deletedTag = await tag_1.default.findByIdAndDelete(tagId);
        if (!deletedTag) {
            throw new Error("invalid tagId");
        }
        return deletedTag;
    }
    //----------------------------------------------------------------------------------------//
    //---------Report-------------------------------------------------------------------------------//
    async findAllReportedBlog() {
        return await report_1.default.find().sort({ createdAt: -1 });
    }
    async getAllBlog() {
        return await blog_1.default.find().sort({ createdAt: -1 });
    }
    //----------------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------------//
    async getAllClient() {
        return await client_1.default.find().sort({ createdAt: -1 });
    }
}
exports.AdminRepository = AdminRepository;
