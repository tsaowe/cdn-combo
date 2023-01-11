import * as R from 'ramda';
import path from 'path';
import {
  rememberChildProcessExecInSeconds,
  viewPackageVersions,
  directoryTree,
} from "@server/src/util";

import childProcess from "child_process";

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
}


describe("server/src/util.test.js", () => {

  test("rememberChildProcessExecInSeconds", async () => {
    const command = "npm view jquery versions --json";
    const time1 = Date.now();
    const result1 = await rememberChildProcessExecInSeconds(command);
    const time2 = Date.now();
    const result2 = await rememberChildProcessExecInSeconds(command);
    const time3 = Date.now();
    expect(result1).toEqual(result2);
    const diff1 = time2 - time1;
    const diff2 = time3 - time2 === 0 ? 1 : time3 - time2;
    expect(diff1 / diff2).toBeGreaterThan(100);
  }, 60 * 1000);


  test("viewPackageVersions", async () => {
    const packageName = "jquery";
    const result1 = await runCommand(`npm view ${packageName} versions --json`);
    const list = await viewPackageVersions(packageName);
    expect(JSON.parse(result1)).toEqual(R.reverse(list));
  });

  test("directoryTree", async () => {
    const currentDirectory = path.resolve(__dirname);
    const result = await runCommand(`ls -R ${currentDirectory}`);
    const resultList = result.split(/\s+/g);
    const resultListTrimmedAndFiltered = R.filter(
      (item) => item !== "" && item !== "." && item !== "..",
      resultList
    );
    const compareListValues = R.map(
      (item) => item.replace(currentDirectory, ""),
      resultListTrimmedAndFiltered
    );
    const compareList1 = R.map(
      (item) => ({
        path: path.resolve(currentDirectory, item),
        type: "file",
        name: item,
      }),
      compareListValues
    );
    const directoryTreeResult = directoryTree(currentDirectory);
    expect(directoryTreeResult.children).toEqual(compareList1);
  });

});
