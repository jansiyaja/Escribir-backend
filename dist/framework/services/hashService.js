"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHashService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptHashService {
    async hash(password) {
        return await bcrypt_1.default.hash(password, 10);
    }
    async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
}
exports.BcryptHashService = BcryptHashService;
