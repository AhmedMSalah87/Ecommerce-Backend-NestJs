import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export const imageValidator: FileValidator[] = [
  new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/i }),
  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
];
