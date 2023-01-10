import { rememberChildProcessExecInSeconds } from "@server/src/util";


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
});
