"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const client_1 = __importDefault(require("../../framework/models/client"));
class ClientRepository {
    async create(client) {
        const newClient = new client_1.default(client);
        return newClient.save();
    }
    async updateClientDetails(id, clientDetails) {
        return await client_1.default.findByIdAndUpdate(id, clientDetails, { new: true }).exec();
    }
}
exports.ClientRepository = ClientRepository;
