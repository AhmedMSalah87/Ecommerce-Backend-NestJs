import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY!,
      },
    });
  }

  uploadFile = async (file: Express.Multer.File, fileKey: string) => {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.client.send(command);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('upload failed');
    }
  };

  getFileFromS3 = async (path: string): Promise<GetObjectCommandOutput> => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: path,
    });

    return await this.client.send(command);
  };

  getFilesFromS3 = async (
    path: string,
  ): Promise<ListObjectsV2CommandOutput> => {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: path,
    });

    return await this.client.send(command);
  };

  deleteFileFromS3 = async (
    path: string,
  ): Promise<DeleteObjectCommandOutput> => {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: path,
    });

    return await this.client.send(command);
  };

  deleteFilesFromS3 = async (
    paths: string[],
  ): Promise<DeleteObjectsCommandOutput> => {
    const mappedKeys = paths.map((path) => {
      return { Key: path };
    });
    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Delete: { Objects: mappedKeys },
    });

    return await this.client.send(command);
  };
}
