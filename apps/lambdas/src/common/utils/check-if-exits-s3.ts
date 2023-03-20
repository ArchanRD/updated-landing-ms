import { S3 } from "aws-sdk";
import { isAWSError } from "../types";

export default async function checkIfFileExistsInS3(
  s3: S3,
  { Bucket, Key }: S3.PutObjectRequest
) {
  try {
    const object = await s3
      .headObject({
        Bucket,
        Key,
      })
      .promise();

    if (object) {
      return true;
    }
  } catch (error) {
    if (isAWSError(error) && error.name === "NotFound") {
      return false;
    }
  }
  return false;
}
