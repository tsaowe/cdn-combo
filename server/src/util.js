import path from "path";
import fs from "fs";
import childProcess from "child_process";
import * as R from "ramda";
import zlib from "zlib";
import tar from "tar";
import { config } from "../constant.js";

import { BehaviorSubject } from "rxjs";

const behaviorSubjectMap = new Map();

export const rememberChildProcessExecInSeconds = (command, seconds = 60) => {
  const key = command;
  let behaviorSubject = behaviorSubjectMap.get(key);
  if (!behaviorSubject) {
    behaviorSubject = new BehaviorSubject(null);
    behaviorSubjectMap.set(key, behaviorSubject);
    setTimeout(() => {
      behaviorSubjectMap.delete(key);
    }, seconds * 1000);
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        behaviorSubject.error(stderr);
      } else {
        behaviorSubject.next(stdout);
      }
    });
  }

  return new Promise((resolve, reject) => {
    behaviorSubject.subscribe({
      next: (value) => {
        if (value) {
          resolve(value);
        }
      },
      error: reject,
    });
  });
};

export const viewPackageVersions = (packageName) => {
  return new Promise((resolve, reject) => {
    rememberChildProcessExecInSeconds(
      `npm view ${packageName} versions --json`
    ).then(
      (stdout) => {
        const versionList = JSON.parse(stdout);
        resolve(R.reverse(versionList));
      },
      (stderr) => {
        reject(stderr);
      }
    );
  });
};

/**
 * just list all the files in the folder, if has sub folder, use children to list
 * @param folderPath
 */
export const directoryTree = (folderPath) => {
  const name = path.basename(folderPath);
  const item = { path: folderPath, name };
  let stats;
  try {
    stats = fs.lstatSync(folderPath);
  } catch (e) {
    return null;
  }
  if (stats.isFile()) {
    item.type = "file";
  } else if (stats.isDirectory()) {
    item.type = "folder";
    item.children = fs
      .readdirSync(folderPath)
      .map((child) => directoryTree(path.join(folderPath, child)))
      .filter((e) => !!e);
  }
  return item;
};

/**
 * @param filePath          ~/cdn-combo-repo/combo/antd/antd-5.0.1.tgz
 * @param targetFolderName  ~/cdn-combo-repo/combo/antd/5.0.1
 * @return {Promise<unknown>}
 */
export const unTar = ({ filePath, targetFolderName }) => {
  const isScoped = filePath.includes("@");
  let { dir } = path.parse(filePath);
  if (isScoped) {
    dir = path.resolve(dir, "..");
  }
  const scopedFilePath = path.resolve(
    dir,
    filePath.replace(dir, "").replace(/^\/?@/, "").replace(/\//g, "-")
  );
  fs.mkdirSync(path.resolve(dir, targetFolderName), { recursive: true });
  const realFilePath = isScoped ? scopedFilePath : filePath;
  return new Promise((resolve, reject) => {
    // noinspection JSUnresolvedFunction
    fs.createReadStream(realFilePath)
      .on("error", () => {
        fs.unlink(realFilePath, () => {});
        reject();
      })
      .pipe(zlib.Unzip())
      .pipe(
        tar.extract({
          cwd: path.resolve(dir, targetFolderName),
          strip: 1,
        })
      )
      .on("end", () => {
        fs.unlink(realFilePath, () => {});
        resolve();
      });
  });
};

/**
 * download the package and save it to config.comboFolder
 * prerequisite: packageName@version should be valid
 *
 * @param packageName antd / @ant-design/icons
 * @param version     5.0.1
 */
export const download = (packageName, version) => {
  const { comboFolder } = config;
  // ~/cdn-combo-repo/combo/antd/
  const isScoped = packageName.startsWith("@");
  const packageNameFolderUnderComboFolder = !isScoped
    ? path.resolve(comboFolder, packageName)
    : path.resolve(
        comboFolder,
        packageName.split("/")[0],
        packageName.split("/")[1]
      );
  if (!fs.existsSync(packageNameFolderUnderComboFolder)) {
    fs.mkdirSync(packageNameFolderUnderComboFolder, { recursive: true });
  }
  // ~/cdn-combo-repo/combo/antd/antd-5.0.1.tgz
  const packageVersionTarballUnderComboFolder = path.resolve(
    packageNameFolderUnderComboFolder,
    `${packageName}-${version}.tgz`
  );
  // ~/cdn-combo-repo/combo/antd/5.0.1

  const packageVersionFolderUnderComboFolder = path.resolve(
    packageNameFolderUnderComboFolder,
    version
  );
  if (fs.existsSync(packageVersionFolderUnderComboFolder)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    //  download packageName@version tarball to packageNameFolderUnderComboFolder
    childProcess.exec(
      `npm pack ${packageName}@${version}`,
      { cwd: packageNameFolderUnderComboFolder },
      (error, stdout, stderr) => {
        if (error) {
          console.log(`npm pack ${packageName}@${version}`);
          console.log(stderr);
          reject(stderr);
        } else {
          //  unTar the tarball to packageNameFolderUnderComboFolder
          unTar({
            filePath: packageVersionTarballUnderComboFolder,
            targetFolderName: version,
          }).then(() => {
            console.log("download and untar success");
            try {
              fs.unlink(packageVersionTarballUnderComboFolder, () => {});
            } catch (e) {
              console.log(e);
            }
            resolve();
          });
        }
      }
    );
  });
};

/**
 * get time of 1 year after from now
 * format: ddd, DD MMM YYYY HH:mm:ss GMT
 */
export const getExpiresTime = (year = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + year);
  return d.toUTCString();
};
