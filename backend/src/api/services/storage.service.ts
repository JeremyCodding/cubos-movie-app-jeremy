/// <reference types="multer" />

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_S3_REGION!;

  const fileExtension = file.originalname.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file.');
  }
};
