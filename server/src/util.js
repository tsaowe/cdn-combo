import childProcess from "child_process";
import * as R from 'ramda';

export const viewPackageVersions = (packageName) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`npm view ${packageName} versions --json`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        const versionList = JSON.parse(stdout);
        resolve(R.reverse(versionList));
      }
    });
  });
}
