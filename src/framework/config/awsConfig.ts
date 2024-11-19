import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'; 
import dotenv from 'dotenv';
 dotenv.config()
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketRegion = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;


if (!awsAccessKey || !secretKey || !bucketRegion || !bucketName) {
    throw new Error('AWS credentials and bucket information must be provided in the environment variables');
  }
 export const s3= new S3Client({
    credentials:{
        accessKeyId:awsAccessKey,
        secretAccessKey:secretKey,
    },
    region:bucketRegion
    
})