import path from "path";
import fs from "fs";
import {comboFolder} from "../constant.js";

const downloadAndTree = async (ctx, packageName, version) => {
  try {
    const parentFolderPath = path.resolve(
      __dirname,
      "..",
      comboFolder,
      packageName,
      version
    );
    if (!fs.existsSync(parentFolderPath)) {
      try {
        await download(packageName, version);
      } catch (e) {
        error(e);
      }
    }
    ctx.body = tree(parentFolderPath, packageName, version);
    // ctx.body = treeData;
  } catch (e) {
    ctx.body = e;
  }
};
