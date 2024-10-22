import createApp from './app';
import dotenv from 'dotenv';
import { connectDB } from './framework/config/dbConfig';
import { createServer } from 'http'; 



dotenv.config();


connectDB();


const app = createApp();


const server = createServer(app);



const port = process.env.PORT || 5000;


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
