import {config} from "../constant.js";
import {viewPackageVersions} from "./util.js";

export const system = async (ctx) => {
  ctx.body = {
    message: "system",
    config,
  };
}


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
}

export const treePackage = async (ctx) => {

}

export const viewGroupPackageTree = async (ctx) => {
  const { scope, packageName, version } = ctx.params;
  ctx.body = `viewGroupPackageTree: @${scope}/${packageName}/${version}`;
}

export const viewSimplePackageTree = async (ctx) => {
  const { packageName, version } = ctx.params;
  ctx.body = `viewSimplePackageTree: ${packageName}/${version}`;
}


export const viewPackageVersionSwitch = async (ctx) => {
  const { packageName, version } = ctx.params;
  if (!packageName.startsWith("@")) {
    // 包名不是以@开头,那么就是简单包
    return viewSimplePackage(ctx);
  } else {

    const realPackageName = `@${packageName}/${version}`;

  }
}
