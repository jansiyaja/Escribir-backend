"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementRepository = void 0;
const advertisement_1 = __importDefault(require("../../framework/models/advertisement"));
class AdvertisementRepository {
    async create(ad_Data) {
        const advertisement = new advertisement_1.default(ad_Data);
        return await advertisement.save();
    }
    async findById(adId) {
        return advertisement_1.default.findById(adId).exec();
    }
    async findUserById(userId) {
        const ad = await advertisement_1.default.find({ userId: userId });
        return ad;
    }
    async findAllAds() {
        return await advertisement_1.default.find().sort({ createdAt: -1 });
    }
    async findAllUserAds(userId) {
        return await advertisement_1.default.find({ userId: userId });
    }
    async update(id, adData) {
        const ad = await advertisement_1.default.findByIdAndUpdate(id, adData, { new: true });
        if (!ad) {
            throw new Error('Blog not found');
        }
        return ad;
    }
}
exports.AdvertisementRepository = AdvertisementRepository;
