import { parse } from "path";
import { existsSync, mkdirSync } from "fs";

export default function createDirectoryForPath(filePath: string) {
  const dirName = parse(filePath).dir;
  if (!existsSync(dirName)) {
    mkdirSync(dirName, { recursive: true });
    console.log(`[DIRECTORY CREATED] ${dirName}`);
  } else {
    console.log(`[DIRECTORY EXISTS] ${dirName}`);
  }
  return filePath;
}
