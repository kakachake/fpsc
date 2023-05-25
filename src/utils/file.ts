import { fpscLog } from "./log";
import fs from "fs-extra";
/**
 * @name 判断文件夹存不存在
 */
export const pathExists = async (
  name: string,
  ext: boolean = true
): Promise<boolean | void> => {
  const res = await fs.pathExists(`${name}`);
  if (!res) {
    ext && fpscLog.error(`${name}不存在`);
    return false;
  } else {
    return res;
  }
};
