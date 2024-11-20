import createApp from "./app";
import dotenv from "dotenv";
import { connectDB } from "./framework/config/dbConfig";
import { createServer } from "http";

import { setupSocket } from "./framework/config/socketConfig";

dotenv.config();

connectDB();

const app = createApp();

const server = createServer(app);
const io = setupSocket(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
