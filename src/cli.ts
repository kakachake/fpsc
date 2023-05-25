import cac from "cac";
import prompts from "prompts";
import { getPackageJson } from "./utils/base";
import { fpscLog } from "./utils/log";
import { FPSCCore } from "./core";
import { Lib, pkgManager } from "./constant";

export const runCli = () => {
  const cli = cac("fpsc");

  cli.command("", "Initialize a new project").action(async (root, options) => {
    await runPrompts();
  });

  cli.help();
  cli.parse();
};

const runPrompts = async () => {
  try {
    const options: prompts.Answers<"lib" | "pkgManager"> = await prompts([
      {
        type: "select",
        name: "lib",
        message: "Select what library you use currently",
        choices: [
          { title: Lib.React, value: Lib.React },
          { title: Lib.Vue2, value: Lib.Vue2 },
          { title: Lib.Vue3, value: Lib.Vue3 },
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "pkgManager",
        message: "Select what package manager you use currently",
        choices: [
          { title: pkgManager.NPM, value: pkgManager.NPM },
          { title: pkgManager.PNPM, value: pkgManager.PNPM },
          { title: pkgManager.YARN, value: pkgManager.YARN },
        ],
        initial: 0,
      },
    ]);
    await start(options);
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
};

const start = async (options: prompts.Answers<"lib" | "pkgManager">) => {
  try {
    fpscLog.info("start init project");
    const { lib, pkgManager } = options;
    const { pkg, pkgPath } = await getPackageJson();
    new FPSCCore({
      lib,
      pkg,
      pkgPath,
      pkgManager,
    });
  } catch (error: any) {
    fpscLog.error(error.message);
  }
};
