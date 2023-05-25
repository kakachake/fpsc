import path from "path";
import fs from "fs/promises";
import { getpath } from "./path";

const initialPkg = {
  // 默认初始化一下
  scripts: {},
  devDependencies: {},
  dependencies: {},
};

export const getPackageJson = async (base: string = "") => {
  const pkgPath = getpath("package.json", base);
  const pkg = JSON.parse((await fs.readFile(pkgPath)).toString());

  return {
    pkg: {
      ...initialPkg,
      ...pkg,
    },
    pkgPath,
  };
};
