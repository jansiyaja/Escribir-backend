import createApp from "./app";
import  dotenv from'dotenv'
import { connectDB } from "./framework/config/dbConfig";
  
dotenv.config()
connectDB()
 const app=createApp();

 const port= process.env.PORT
 app.listen(port,()=>{
    console.log(`serverr listen on ${port}` );
    
 })