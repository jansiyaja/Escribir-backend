import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import { userRouter } from "./Routes/userRoutes";
import { adminRouter } from "./Routes/adminRoutes";
import { errorHandler } from "./framework/middleWares/errorHandler";
import { blogRouter } from "./Routes/blogRouter";
import { socialRoute } from "./Routes/socialRoutes";
import { chatRoute } from "./Routes/chatRoute";

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
next() 
})

  app.use("/users", () => console.log(), userRouter);
  app.use("/admin", adminRouter);
  app.use("/social", socialRoute);
  app.use("/blog", blogRouter);
  app.use("/chat", chatRoute);

  app.use(errorHandler);

  return app;
};

export default createApp;
