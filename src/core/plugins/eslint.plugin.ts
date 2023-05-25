import { FPSCCore, IPluginContructor, IPluginInterface } from "..";
import { Lib, LibUnion } from "../../constant";
import { getEslintConfig } from "../../template/eslintConfig";
import { writeInPkg } from "../../utils/pkg";
import fs from "fs-extra";
import path from "path";
import { prettierrcInit } from "../../template/prettierrc";

const eslintDeps = [
  "eslint@^7.25.0",
  "prettier@^2.7.1",
  "eslint-friendly-formatter@^4.0.1",
  "eslint-plugin-prettier@^4.0.0",
  "eslint-plugin-html@^6.2.0",
  "eslint-config-prettier@^8.5.0",
];

const libEslintDeps: Record<LibUnion, string[]> = {
  [Lib.React]: [
    "eslint-plugin-react@^7.30.1",
    "eslint-plugin-jsx-a11y@^6.6.1",
    "@typescript-eslint/parser@^5.30.7",
    "@typescript-eslint/eslint-plugin@5.30.7",
  ],
  [Lib.Vue2]: ["eslint-plugin-vue@^6.2.2"],
  [Lib.Vue3]: ["eslint-plugin-vue@^9.2.0", "@typescript-eslint/parser@^5.30.7"],
};

export const EslintPlugin: IPluginContructor = class EslintPlugin
  implements IPluginInterface
{
  ins: FPSCCore;
  constructor(ins: FPSCCore) {
    this.ins = ins;
  }

  async apply() {
    const ins = this.ins;
    const { pkg, lib } = ins.options;
    libEslintDeps;
    const devDeps = [...eslintDeps, ...libEslintDeps[lib]];
    // await writeInPkg(devDeps, "devDependencies", pkg);
    // ins.writePkg();

    await ins.installPkg({
      devDependencies: devDeps,
    });
    const eslintConfig = getEslintConfig(lib);

    fs.outputFileSync(path.resolve("./.eslintrc.js"), eslintConfig);
    fs.outputFileSync(path.resolve("./.prettierrc"), prettierrcInit);
  }
};
