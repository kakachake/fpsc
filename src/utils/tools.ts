import spawn from "cross-spawn";
import { fpscLog } from "./log";
export const run = async (str: string) => {
  const runArr = str.split(" ");
  if (runArr.length < 2) {
    fpscLog.error(`运行参数错误${str}`);
    return false;
  }
  const [npm, ...args] = runArr;
  fpscLog.info(`${runArr.join(" ")}✅`);
  spawn.sync(npm, args, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
};
