import { S3 } from "aws-sdk";
import { PassThrough } from "stream";

export function uploadFromStream(s3: S3, params: S3.PutObjectRequest) {
  var pass = new PassThrough();

  s3.upload(
    {
      ...params,
      Body: pass,
    },
    (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        console.log(err, data);
      }
    }
  );

  return pass;
}

export async function uploadFile(s3: S3, params: S3.PutObjectRequest) {
  console.log(`[UPLOAD]: ${params.Key}`);

  return s3.upload(params).promise();
}
