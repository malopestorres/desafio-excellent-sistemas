import { diskStorage } from 'multer';
import { extname, join, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';

const UPLOADS_DIR_NAME = 'uploads';

export const UPLOADS_DIR = resolve(process.cwd(), UPLOADS_DIR_NAME);

const MAX_FILE_SIZE_MB = 5;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export function ensureUploadsDir(): void {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const imagesStorage = diskStorage({
  destination: (_req, _file, callback) => {
    ensureUploadsDir();
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = extname(file.originalname);
    const filename = `${randomUUID()}${extension}`;
    callback(null, filename);
  },
});

export function imagesFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(
    new BadRequestException(
      `Tipo de arquivo inválido: ${file.mimetype}. Envie apenas imagens.`,
    ),
    false,
  );
}

export const imagesUploadOptions = {
  storage: imagesStorage,
  fileFilter: imagesFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 10,
  },
};

export function toUploadsUrl(filename: string): string {
  return join('/uploads', filename);
}