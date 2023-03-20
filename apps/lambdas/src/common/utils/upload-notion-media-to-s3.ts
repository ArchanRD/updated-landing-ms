import path from "path";
import { promisify } from "util";
import { pipeline, PipelineSource } from "stream";
import { uploadFromStream } from "./upload-from-stream";
import { S3 } from "aws-sdk";
import fetch from "node-fetch";
import checkIfFileExistsInS3 from "./check-if-exits-s3";

const s3 = new S3({ apiVersion: "2006-03-01" });

export type DownloadFnProps = {
  url: string;
  filePath: string;
  fileName: string;
  metadata?: S3.Metadata;
  bucket: string;
};

export const downloadFileFromURLAndUploadToS3 = async ({
  url,
  filePath,
  fileName,
  metadata = {},
  bucket,
}: DownloadFnProps) => {
  const streamPipeline = promisify(pipeline);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `[SourceLogo Uploader Error] Failed to download the File ${
        response.status
      } ${response.statusText}: ${url} \n ${JSON.stringify(metadata, null, 2)}`
    );
  }

  const downloadFileName = response?.headers.get("content-disposition");
  const contentType = response?.headers.get("content-type");

  const ext =
    downloadFileName && path.parse(downloadFileName).ext
      ? path.parse(downloadFileName).ext
      : "." + contentType?.split("/")[1];

  if (!ext) {
    throw new Error(
      `[SourceLogo Uploader Error] file ext not available \n ${JSON.stringify(
        {
          downloadFileName,
          metadata,
        },
        null,
        2
      )}`
    );
  }

  const Key = filePath + fileName + ext;

  const s3UploadParams = {
    Bucket: bucket,
    Key,
    ACL: "public-read",
    CacheControl: "max-age=365000000,immutable",
    Metadata: metadata,
  };

  if (await checkIfFileExistsInS3(s3, s3UploadParams)) {
    console.log("[Seed Sources]: File Exists in S3, Skipping Upload");
    return Key;
  }

  const destinationStream = uploadFromStream(s3, s3UploadParams);

  await streamPipeline(
    response.body as unknown as PipelineSource<ReadableStream<Uint8Array>>,
    destinationStream
  );

  console.log("Uploaded file, ", Key);

  return Key;
};
