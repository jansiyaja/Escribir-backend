import createApp from './app';
import dotenv from 'dotenv';
import { connectDB } from './framework/config/dbConfig';
import { createServer } from 'http'; 
import { Server as socketIo } from 'socket.io'; 
import { setupSocket } from './framework/config/socketConfig';
import cors from 'cors';


dotenv.config();


connectDB();


const app = createApp();


const server = createServer(app);
const io = setupSocket(server);


const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
