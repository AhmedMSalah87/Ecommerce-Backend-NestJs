import { Module } from '@nestjs/common';
import { S3Service } from './providers/s3-storage.service';
import { StorageService } from './storage.service';

@Module({
  providers: [S3Service, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
