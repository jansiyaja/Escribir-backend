"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = __importDefault(require("../../framework/models/user"));
class UserRepository {
    async create(user) {
        const newUser = new user_1.default(user);
        return newUser.save();
    }
    async findById(id) {
        return await user_1.default.findById(id).lean().exec();
    }
    async findByEmail(email) {
        return await user_1.default.findOne({ email }).lean().exec();
    }
    async delete(id) {
        await user_1.default.findByIdAndDelete(id).lean().exec();
    }
    async markAsVerified(email) {
        await user_1.default.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true }).exec();
    }
    async userRole(id, role) {
        return await user_1.default.findByIdAndUpdate(id, { role }, { new: true }).lean().exec();
    }
    async updateUserDetails(id, userDetails) {
        return await user_1.default.findByIdAndUpdate(id, userDetails, { new: true }).lean().exec();
    }
}
exports.UserRepository = UserRepository;
