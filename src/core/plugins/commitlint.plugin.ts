import path from "path";
import { FPSCCore, IPluginContructor, IPluginInterface } from "..";
import { run } from "../../utils/tools";
import fs from "fs-extra";
import { commitLintConfig } from "../../template/commitlint.config";

const devDependencies = [
  "@commitlint/cli@^17.0.3",
  "@commitlint/config-angular@^17.0.3",
  "commitizen@^4.2.4",
  "cz-customizable@^6.9.0",
  "@commitlint/cz-commitlint@^17.0.3",
  "inquirer@^8.0.0",
];

const commitMsg = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
`;

const preCommit = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npm run pre-commit
`;

export const CommitLintPlugin: IPluginContructor = class CommitLintPlugin
  implements IPluginInterface
{
  ins: FPSCCore;
  constructor(ins: FPSCCore) {
    this.ins = ins;
  }
  async apply(): Promise<void> {
    const { pkg } = this.ins.options;
    await this.ins.installPkg({
      devDependencies,
    });
    await run('npx husky add .husky/commit-msg "npm-run-test"');
    pkg["config"] = {
      commitizen: {
        path: "@commitlint/cz-commitlint",
      },
    };
    pkg["scripts"]["commit"] = "git add . && git-cz";
    this.ins.writePkg();
    const commitlintPath = path.resolve("commitlint.config.js");
    if (await fs.pathExists(commitlintPath)) {
      // 删除
      fs.removeSync(commitlintPath);
    }
    fs.outputFileSync(commitlintPath, commitLintConfig);
    fs.outputFileSync(path.resolve("./.husky/commit-msg"), commitMsg);
    fs.outputFileSync(path.resolve("./.husky/pre-commit"), preCommit);
  }
};
