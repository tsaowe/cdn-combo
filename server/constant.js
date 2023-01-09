import path from "path";

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const comboFolder = path.resolve(__dirname, "..", "combo");

export const projectFolder = path.resolve(__dirname, "..");

export const projectServerFolder = path.resolve(projectFolder, "server");


export const config = {
  __dirname,
  __filename,
  comboFolder,
  projectFolder,
  projectServerFolder,
}
