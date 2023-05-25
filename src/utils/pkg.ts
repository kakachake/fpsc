import { PkgManagerUnion } from "../constant";
import { fpscLog } from "./log";
import { run } from "./tools";

export const writeInPkg = async (
  devArr: string[],
  key: "devDependencies" | "dependencies" = "devDependencies",
  pkg: any
) => {
  devArr.forEach((item) => {
    const index = item.lastIndexOf("@");
    const pkgName = index === -1 ? item : item.slice(0, index);
    const pkgVersion = index === -1 ? "" : item.slice(index + 1) || "";
    pkg[key][pkgName] = pkgVersion;
    fpscLog.info(`${item}✅`);
  });
};

export const downNodeModules = async (
  pcks: { devDependencies?: string[]; dependencies?: string[] },
  pkgManager: PkgManagerUnion
) => {
  const { dependencies, devDependencies } = pcks;

  if (devDependencies && devDependencies.length) {
    await run(`${pkgManager} install ${devDependencies.join(" ")} -D`);
  }
  if (dependencies && dependencies.length) {
    await run(`${pkgManager} install ${dependencies.join(" ")} -S`);
  }
};
