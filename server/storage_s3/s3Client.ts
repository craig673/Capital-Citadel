/**
 * Portable S3-compatible object storage client.
 * Replaces the Replit-specific GCS sidecar integration.
 * Works with AWS S3, Cloudflare R2, Backblaze B2, MinIO, etc.
 *
 * Required environment variables:
 *   S3_BUCKET_NAME      - The name of your S3 bucket
 *   S3_REGION           - AWS region (e.g. "us-east-1") or "auto" for R2
 *   AWS_ACCESS_KEY_ID   - Your S3 access key ID
 *   AWS_SECRET_ACCESS_KEY - Your S3 secret access key
 *   S3_ENDPOINT         - (Optional) Custom endpoint for R2/B2/MinIO
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import type { Response } from "express";
import { Readable } from "stream";

function getS3Config() {
  const region = process.env.S3_REGION || "us-east-1";
  const endpoint = process.env.S3_ENDPOINT;
  return {
    region,
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  };
}

export function getS3Client(): S3Client {
  return new S3Client(getS3Config());
}

export function getBucketName(): string {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME environment variable is not set");
  }
  return bucket;
}

/**
 * Upload a file buffer to S3.
 * Returns the S3 object key (path within the bucket).
 */
export async function uploadToS3(
  buffer: Buffer,
  folder: string,
  originalName: string,
  contentType: string
): Promise<string> {
  const ext = path.extname(originalName);
  const uniqueName = `${randomUUID()}${ext}`;
  const objectKey = `${folder}/${uniqueName}`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return objectKey;
}

/**
 * Stream a file from S3 directly to an Express response.
 */
export async function downloadFromS3(
  objectKey: string,
  res: Response,
  downloadName: string
): Promise<void> {
  const client = getS3Client();

  // Check if file exists via HeadObject
  try {
    const head = await client.send(
      new HeadObjectCommand({ Bucket: getBucketName(), Key: objectKey })
    );

    res.set({
      "Content-Type": head.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadName)}"`,
      ...(head.ContentLength
        ? { "Content-Length": String(head.ContentLength) }
        : {}),
    });
  } catch {
    res.status(404).json({ error: "File not found on server" });
    return;
  }

  const getCmd = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: objectKey,
  });

  const response = await client.send(getCmd);
  if (!response.Body) {
    res.status(404).json({ error: "File not found on server" });
    return;
  }

  (response.Body as Readable).pipe(res as unknown as NodeJS.WritableStream);
}

/**
 * Delete a file from S3.
 */
export async function deleteFromS3(objectKey: string): Promise<void> {
  if (!objectKey || !objectKey.includes("/")) {
    // Skip deletion for legacy local paths or empty keys
    return;
  }
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({ Bucket: getBucketName(), Key: objectKey })
  );
}

/**
 * Generate a presigned PUT URL for direct client-side uploads.
 */
export async function getPresignedUploadUrl(
  folder: string,
  contentType: string
): Promise<{ uploadURL: string; objectKey: string }> {
  const objectKey = `${folder}/${randomUUID()}`;
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadURL = await getSignedUrl(client, command, { expiresIn: 900 });
  return { uploadURL, objectKey };
}
