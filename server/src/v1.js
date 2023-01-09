import path from "path";
import fs from "fs";
import moment from 'moment';
import { config } from "../constant.js";
import { directoryTree, download, viewPackageVersions } from "./util.js";
import {sameMimeType} from "./same-mime-type.js";
import {getMimeType} from "./get-mime-type.js";

export const system = async (ctx) => {
  ctx.body = {
    message: "system",
    config,
  };
};

export const viewSimplePackage = async (ctx) => {
  const { packageName } = ctx.params;
  try {
    ctx.body = await viewPackageVersions(packageName);
  } catch (e) {
    ctx.body = e;
  }
};

export const viewGroupPackage = async (ctx) => {
  const { scope, packageName } = ctx.params;
  const realPackageName = `@${scope}/${packageName}`;
  try {
    ctx.body = await viewPackageVersions(realPackageName);
  } catch (e) {
    ctx.body = e;
  }
};


export const viewSimplePackageTree = async (ctx) => {
  const { packageName, version } = ctx.params;
  try {
    await download(packageName, version);
    ctx.body = directoryTree(
      path.join(config.comboFolder, packageName, version)
    );
  } catch (e) {
    ctx.body = e;
  }
};

export const viewGroupPackageTree = async (ctx) => {
  const { scope, packageName, version } = ctx.params;
  const realPackageName = `@${scope}/${packageName}`;
  try {
    await download(realPackageName, version);
    ctx.body = directoryTree(
      path.join(config.comboFolder, realPackageName, version)
    );
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
    if (sameMimeType(list)) {
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
          const parentFolderPath = path.resolve(config.comboFolder, packageName, version);
          if (!fs.existsSync(parentFolderPath)) {
            await download(packageName, version);
          }
          return new Promise((resolve, reject) => {
            const innerPath = (restPath || []).join("/");
            fs.readFile(
              path.resolve(parentFolderPath, innerPath || ".", base),
              (err, content) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(content);
                }
              }
            );
          });
        })
      );

      const resHeaders = {};
      resHeaders["Expires"] = moment()
        .add(1, "years")
        .format("ddd, DD MMM YYYY HH:mm:ss GMT");
      resHeaders["Cache-Control"] = "max-age=315360000";
      resHeaders["Last-Modified"] = moment().format(
        "ddd, DD MMM YYYY HH:mm:ss GMT"
      );
      resHeaders["Content-Type"] = getMimeType(list);
      resHeaders["Access-Control-Allow-Origin"] = "*";
      ctx.set(resHeaders);

      ctx.body = contents.join("\n");
    } else {
      ctx.body = "mime type is not same";
    }
  } catch (e) {
    console.log(e);
    ctx.body = "exception";
  }
}
