"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketRegion = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;
if (!awsAccessKey || !secretKey || !bucketRegion || !bucketName) {
    throw new Error('AWS credentials and bucket information must be provided in the environment variables');
}
exports.s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: secretKey,
    },
    region: bucketRegion
});
