"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const IAdvertisement_1 = require("../../entities/IAdvertisement");
const AdvertisementSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    targetAudience: { type: String, required: true },
    industry: { type: String, required: true },
    format: { type: String, enum: ["Video Ad", "Image Ad", "Text Ad"], required: true },
    link: { type: String, required: true },
    contents: [
        {
            type: { type: String, enum: Object.values(IAdvertisement_1.AdContent), required: true },
            value: { type: String, required: true },
        },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Advertisement", AdvertisementSchema);
