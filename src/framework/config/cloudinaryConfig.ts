import { v2 as cloudinary } from 'cloudinary';
 import dotenv from 'dotenv';
 dotenv.config()
 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

    max_image_width: 500,
    max_image_height: 500,
    eager: [
      { width: 300, height: 300, crop: "pad" },
      { width: 600, height: 600, crop: "pad" }
    ]
  });
  
export { cloudinary };
