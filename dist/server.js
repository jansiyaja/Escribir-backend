"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = require("./framework/config/dbConfig");
const http_1 = require("http");
const socketConfig_1 = require("./framework/config/socketConfig");
dotenv_1.default.config();
(0, dbConfig_1.connectDB)();
const app = (0, app_1.default)();
const server = (0, http_1.createServer)(app);
const io = (0, socketConfig_1.setupSocket)(server);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port} http://localhost:3000`);
});
