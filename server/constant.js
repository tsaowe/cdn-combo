import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const comboFolder = path.resolve(__dirname, "..", "combo");

export const projectFolder = path.resolve(__dirname, "..");

export const projectServerFolder = path.resolve(projectFolder, "server");

if (!fs.existsSync(comboFolder)) {
  fs.mkdirSync(comboFolder, { recursive: true });
}

export const config = {
  __dirname,
  __filename,
  comboFolder,
  projectFolder,
  projectServerFolder,
};
