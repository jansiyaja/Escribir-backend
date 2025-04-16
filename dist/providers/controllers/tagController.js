"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
class TagController {
    constructor(_blogUseCase) {
        this._blogUseCase = _blogUseCase;
    }
    async listTags(req, res) {
        try {
            logger_1.logger.info("Fetching all tags");
            const tags = await this._blogUseCase.getAllTags();
            res.status(httpEnums_1.HttpStatusCode.OK).json(tags);
        }
        catch (error) {
            logger_1.logger.error("Error listing tags:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list tags" });
        }
    }
    async trendTags(req, res) {
        try {
            logger_1.logger.info("Fetching all tags");
            const tags = await this._blogUseCase.getTrendingTags();
            res.status(httpEnums_1.HttpStatusCode.OK).json(tags);
        }
        catch (error) {
            logger_1.logger.error("Error listing tags:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list tags" });
        }
    }
    async TagByBlogs(req, res) {
        console.log("Fetching blogs by tag...");
        const { tag } = req.params;
        if (typeof tag !== "string") {
            res
                .status(httpEnums_1.HttpStatusCode.BAD_REQUEST)
                .json({ error: "Invalid or missing tag parameter" });
        }
        try {
            const blogs = await this._blogUseCase.getTagBYBlogs(tag);
            res.status(httpEnums_1.HttpStatusCode.OK).json(blogs);
        }
        catch (error) {
            logger_1.logger.error("Error fetching blogs by tag:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to fetch blogs by tag" });
        }
    }
}
exports.TagController = TagController;
