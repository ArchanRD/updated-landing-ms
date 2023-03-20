// src/get-env-var.ts
import invariant from "tiny-invariant";
function getEnvVar(identifier, required = false) {
  const envVar = process.env[identifier];
  invariant(
    !(envVar === void 0 && required),
    `${identifier} is a required ENVIRONMENT variable. Please check your .env files to include a valid value`
  );
  return envVar || "";
}
export {
  getEnvVar
};
