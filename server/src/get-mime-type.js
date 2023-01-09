import path from "path";
import mime from "./mime.js";

export const getMimeType = (list = []) => {
  const { ext } = path.parse(list[0]);
  return mime[ext.substr(1)];
};
