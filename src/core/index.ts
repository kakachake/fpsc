import fs from "fs-extra";

import { LibUnion, PkgManagerUnion } from "../constant";
import { getpath } from "../utils/path";
import * as basePlugins from "./plugins";
import { fpscLog } from "../utils/log";
import { downNodeModules } from "../utils/pkg";
import { getPackageJson } from "../utils/base";

interface FPSCOptions {
  lib: LibUnion;
  pkg: any;
  pkgPath: string;
  plugins?: IPluginContructor[];
  pkgManager: PkgManagerUnion;
}

export interface IPluginContructor {
  new (ins: FPSCCore): any;
}

export interface IPluginInterface {
  apply(): Promise<void> | void;
}

export class FPSCCore {
  options: FPSCOptions;
  plugins: IPluginInterface[] = [];
  constructor(options: FPSCOptions) {
    this.options = options;
    this.init();
    this.run().then(() => {
      fpscLog.info("完成");
    });
  }
  init() {
    this.install(Object.values(basePlugins));
  }
  install(plugins: IPluginContructor[] | IPluginContructor) {
    plugins = Array.isArray(plugins) ? plugins : [plugins];
    plugins.forEach((Plugin) => {
      this.plugins.push(new Plugin(this));
    });
  }
  run() {
    return new Promise<void>(async (resolve, reject) => {
      for (const plugin of this.plugins) {
        await plugin.apply();
      }
      resolve();
    });
  }
  async refreshPkg() {
    const { pkg, pkgPath } = await getPackageJson();
    this.options.pkg = pkg;
    this.options.pkgPath = pkgPath;
  }
  async writePkg(pkg?: any) {
    const { pkgPath } = this.options;
    fpscLog.info("正在写入package.json...");
    const curPkg = pkg || this.options.pkg;
    fs.writeJsonSync(pkgPath, curPkg, { spaces: 2 });
    this.options.pkg = curPkg;
    await this.refreshPkg();
  }
  async installPkg(pkg: {
    devDependencies?: string[];
    dependencies?: string[];
  }) {
    const { pkgPath } = this.options;

    await downNodeModules(pkg, this.options.pkgManager);
  }
}
