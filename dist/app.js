"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = require("./Routes/userRoutes");
const adminRoutes_1 = require("./Routes/adminRoutes");
const errorHandler_1 = require("./framework/middleWares/errorHandler");
const blogRouter_1 = require("./Routes/blogRouter");
const socialRoutes_1 = require("./Routes/socialRoutes");
const chatRoute_1 = require("./Routes/chatRoute");
const clientRoutes_1 = require("./Routes/clientRoutes");
const tagRoutes_1 = require("./Routes/tagRoutes");
const commentRoutes_1 = require("./Routes/commentRoutes");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: "http://localhost:5000",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use('/users', userRoutes_1.userRouter);
    app.use('/admin', adminRoutes_1.adminRouter);
    app.use('/social', socialRoutes_1.socialRoute);
    app.use('/blog', blogRouter_1.blogRouter);
    app.use('/chat', chatRoute_1.chatRoute);
    app.use('/client', clientRoutes_1.clienRoute);
    app.use('/tag', tagRoutes_1.tagRoute);
    app.use('/comment', commentRoutes_1.commentRoute);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.default = createApp;
