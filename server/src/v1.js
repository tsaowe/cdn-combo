import path from "path";
import fs from "fs";
import { config } from "../constant.js";
import {
  download,
  downloadAndUnTarAndTree,
  getExpiresTime,
  viewPackageVersions,
} from "./util.js";
import { checkIsSameMimeType } from "./check-is-same-mime-type.js";
import { getMimeType } from "./get-mime-type.js";
import axios from "axios";

export const renderIndex = async () => {
  const indexHtml = path.resolve(config.projectFolder, "dist", "index.html");
  return fs.readFileSync(indexHtml, "utf-8");
};

export const system = async (ctx) => {
  ctx.body = {
    message: "system",
    config,
  };
};

export const viewSimplePackageVersions = async (ctx) => {
  const { packageName } = ctx.params;
  try {
    ctx.body = await viewPackageVersions(packageName);
  } catch (e) {
    ctx.body = e;
  }
};

export const viewScopePackageVersions = async (ctx) => {
  //  scope is like `@babel` without `@` => `babel`
  const { scope, name } = ctx.params;
  const packageName = `@${scope}/${name}`;
  try {
    ctx.body = await viewPackageVersions(packageName);
  } catch (e) {
    ctx.body = e;
  }
};

export const viewSimplePackageFileTree = async (ctx) => {
  const { packageName, version } = ctx.params;
  try {
    ctx.body = await downloadAndUnTarAndTree(packageName, version);
  } catch (e) {
    ctx.body = e;
  }
};

export const viewScopePackageFileTree = async (ctx) => {
  const { scope, name, version } = ctx.params;
  const packageName = `@${scope}/${name}`;
  try {
    ctx.body = await downloadAndUnTarAndTree(packageName, version);
  } catch (e) {
    ctx.body = e;
  }
};

export const main = async (ctx) => {
  try {
    //  { '?ddd/12.1.1/a.js,ccc/12.1.1/a.js': '' }
    const query = Object.keys(ctx.query)[0] || "";

    //  ddd/12.1.1/a.js,ccc/12.1.1/a.js
    const listStr = query.substring(1);

    //  ['ddd/12.1.1/a.js', 'ccc/12.1.1/a.js']
    const list = listStr.split(",");

    //  是否所有的文件都是一种类型,如果不是一种类型走else逻辑
    if (checkIsSameMimeType(list)) {
      const contents = await Promise.all(
        list.map(async (file) => {
          // {
          //   root: '',
          //     dir: 'ddd/12.1.1/dist',
          //   base: 'a.js',
          //   ext: '.js',
          //   name: 'a'
          // }

          const { dir, base } = path.parse(file);

          const [packageName, version, ...restPath] = dir.split("/");
          const parentFolderPath = path.resolve(
            config.comboFolder,
            packageName,
            version
          );
          if (!fs.existsSync(parentFolderPath)) {
            const realPackageName = packageName.startsWith("@")
              ? `${packageName}/${version}`
              : `${packageName}`;
            const realVersion = packageName.startsWith("@")
              ? restPath[0]
              : version;
            await download(realPackageName, realVersion);
          }
          return new Promise((resolve, reject) => {
            const innerPath = (restPath || []).join("/");
            const filePath = path.resolve(
              parentFolderPath,
              innerPath || ".",
              base
            );
            fs.readFile(filePath, (err, content) => {
              if (err) {
                reject(err);
              } else {
                resolve(content);
              }
            });
          });
        })
      );

      const resHeaders = {};
      resHeaders["Expires"] = getExpiresTime(1);
      resHeaders["Cache-Control"] = "max-age=315360000";
      resHeaders["Last-Modified"] = getExpiresTime();
      resHeaders["Content-Type"] = getMimeType(list);
      resHeaders["Access-Control-Allow-Origin"] = "*";
      ctx.set(resHeaders);

      ctx.body = contents.join("\n");
    } else {
      ctx.body = "mime type is not same";
    }
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
};

export const searchSuggests = async (ctx) => {
  //  get method get query string 'q'
  const { q } = ctx.query;
  const url = `https://www.npmjs.com/search/suggestions?q=${q}`;
  const res = await axios.get(url);
  ctx.body = res.data;
};
