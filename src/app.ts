import express from 'express';
import cors from 'cors';

import { userRouter } from './Routes/userRoutes';
import { errorHandler } from './framework/middleware/errorHandler';
import cookieParser from 'cookie-parser';

const createApp = () => {
  const app = express();


  app.use(express.json());


  app.use(cookieParser());


  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  

  
  app.use('/users', userRouter);


 

 
  app.use(errorHandler);

  return app;
};

export default createApp;
