import { IBlogRepository } from '../../interfaces/repositories/IBlogRepository';
import { IBlogPost } from '../../entities/Blog.Post'; 
import { IBlogUseCase } from '../../interfaces/usecases/IBlogUseCase';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class BlogPostUseCase implements IBlogUseCase {
    constructor(
        private _blogRepository: IBlogRepository,
        private _s3: S3Client
    ) {}

    async createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost>{
        return await this._blogRepository.create(blogPostData);
    }

    async uploadImageToS3(buffer: Buffer, mimeType: string): Promise<string> {
        const key = this.generateRandomKey(); 
        
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };

        const command = new PutObjectCommand(params);

        try {
            await this._s3.send(command); 
            return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new Error('Could not upload image to S3'); 
        }
    }

    private generateRandomKey(): string {
       
        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    async getAllBlogs(): Promise<IBlogPost[]> {
        return this._blogRepository.findAll()
    }
}
