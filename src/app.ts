import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import { userRouter } from './Routes/userRoutes';
import { adminRouter } from './Routes/adminRoutes';
import { errorHandler } from './framework/middleWares/errorHandler';
import { blogRouter } from './Routes/blogRouter';
import { socialRoute } from './Routes/socialRoutes';
import { chatRoute } from './Routes/chatRoute';
import { clienRoute } from "./Routes/clientRoutes";




const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);  // Log the Origin header
  next();  // Continue with the request processing
});

  app.use(cors({
    origin:"https://escribir-frontend.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.options('*', cors({
  origin: "https://escribir-frontend.vercel.app",
  credentials: true,
}));


 app.use('/users', userRouter);
  app.use('/admin', adminRouter);
  app.use('/social',socialRoute)
  app.use('/blog', blogRouter);
  app.use('/chat', chatRoute);
  app.use('/client',clienRoute);

  app.use(errorHandler)

  return app;
};

export default createApp;