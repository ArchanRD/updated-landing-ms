import invariant from "tiny-invariant";

export default function getEnvVar(
  identifier: string,
  required: boolean = false
): string {
  const envVar = process.env[identifier];

  invariant(
    !(envVar === undefined && required),
    `${identifier} is a required ENVIRONMENT variable. Please check your .env files to include a valid value`
  );

  return envVar || "";
}
