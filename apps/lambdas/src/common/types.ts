import type { AWSError } from "aws-sdk";

export const isAWSError = (error: unknown): error is AWSError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "retryable" in error;
