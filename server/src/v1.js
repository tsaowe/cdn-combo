import {config} from "../constant.js";

export const system = async (ctx) => {
  ctx.body = {
    message: "system",
    config,
  };
}



export const viewSimplePackage = async (ctx) => {
  const { packageName } = ctx.params;
  ctx.body = `viewGroupPackage: ${packageName}`;
};


export const viewGroupPackage = async (ctx) => {
  const { scope, packageName } = ctx.params;
  ctx.body = `viewGroupPackage: @${scope}/${packageName}`;
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
