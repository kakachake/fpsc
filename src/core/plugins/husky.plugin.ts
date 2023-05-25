import { FPCSPlugin } from "../basePlugin";
import { IPluginInterface } from "..";
import { IPluginContructor } from "..";
import { pathExists } from "../../utils/file";
import { fpscLog } from "../../utils/log";
import { run } from "../../utils/tools";

// 需要安装的依赖
const devDependencies = ["husky@^8.0.1", "lint-staged@^12.4.1"];

export const HuskyPlugin: IPluginContructor = class HuskyPlugin extends FPCSPlugin {
  async apply() {
    console.log("husky install");

    if (!pathExists(".git", false)) {
      fpscLog.warning("请先初始化git, 使用git init命令");
      process.exit();
    }
    this.ins.installPkg({
      devDependencies,
    });
    const { pkg } = this.ins.options;
    pkg.scripts["prepare"] = "husky install";
    pkg.scripts["pre-commit"] = "lint-staged";
    pkg.scripts["postinstallmac"] =
      "git config core.hooksPath .husky && chmod 700 .husky/*";
    pkg.scripts["eslint"] =
      'eslint --cache --max-warnings 0  "{src,mock}/**/*.{vue,ts,js,tsx}" --fix';
    pkg["lint-staged"] = {
      "*.{js,ts,vue,jsx,tsx}": ["npm run eslint"],
      "*.{js,jsx,ts,tsx,md,html,css,lees,scss,sass}": "prettier --write",
    };
    this.ins.writePkg();
    await run("npm run prepare");
    await run('npx husky add .husky/pre-commit "npm-run-pre-commit"');
  }
};
