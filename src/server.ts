import createApp from "./app";
import  dotenv from'dotenv'
  
dotenv.config()
 const app=createApp();

 const port= process.env.PORT
 app.listen(port,()=>{
    console.log(`serverr listen on ${port}` );
    
 })