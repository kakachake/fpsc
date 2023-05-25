import { FPSCCore } from ".";

export abstract class FPCSPlugin {
  ins: FPSCCore;
  constructor(ins: FPSCCore) {
    this.ins = ins;
  }
  abstract apply(): Promise<void> | void;
}
