const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const { comboFolder } = require("../constant.js");

const localFolderName = "combo";

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

exports.runCommand = runCommand;

const download = (packageName, version) => {
  const projectFolder = path.resolve(__dirname, "..", comboFolder, packageName);

  const installPackage = `${packageName}@${version}`;

  return new Promise(async (resolve, reject) => {
    let packageRemotePath = "";
    try {
      packageRemotePath = await runCommand(
        `npm view ${installPackage} dist.tarball`
      );
    } catch (e) {
      reject(e);
    }
    packageRemotePath = packageRemotePath.trim();
    const distPath = path.resolve(
      __dirname,
      "..",
      localFolderName,
      packageName
    );
    const packagePath = path.resolve(distPath, "package");
    const renamePath = path.resolve(distPath, version);

    if (fs.existsSync(renamePath)) {
      resolve();
    } else {
      if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath, { recursive: true });
      }
      runCommand(`cd ${packagePath} && curl -L ${packageRemotePath} | tar -xz`)
        .then(() => {
          fs.renameSync(packagePath, renamePath);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

module.exports = download;
