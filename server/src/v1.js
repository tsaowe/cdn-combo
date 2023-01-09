import path from "path";
import fs from "fs";
import { config } from "../constant.js";
import { directoryTree, download, viewPackageVersions } from "./util.js";

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

export const treePackage = async (ctx) => {};

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

export const viewPackageVersionSwitch = async (ctx) => {
  const { packageName, version } = ctx.params;
  if (!packageName.startsWith("@")) {
    // 包名不是以@开头,那么就是简单包
    return viewSimplePackage(ctx);
  } else {
    const realPackageName = `@${packageName}/${version}`;
  }
};
