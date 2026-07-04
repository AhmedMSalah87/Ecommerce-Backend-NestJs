import { Injectable } from '@nestjs/common';
import { S3Service } from './providers/s3-storage.service';

@Injectable()
export class StorageService {
  constructor(private readonly provider: S3Service) {}

  async upload(file: Express.Multer.File, key: string) {
    return await this.provider.uploadFile(file, key);
  }

  async delete(key: string) {
    return await this.provider.deleteFileFromS3(key);
  }
}
