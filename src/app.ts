import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/userRoutes';
import { adminRouter } from './Routes/adminRoutes';
import { errorHandler } from './framework/middleWares/errorHandler';
import { blogRouter } from './Routes/blogRouter';




const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

 app.use('/users', userRouter);
  app.use('/admin', adminRouter);
  app.use('/blog', blogRouter);
  
  app.use(errorHandler)

  return app;
};

export default createApp;
