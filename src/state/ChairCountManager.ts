import { makeAutoObservable, reaction } from "mobx";
import { DesignManager } from "./DesignManager";

export class ChairCountManager {
  designManager: DesignManager;

  // current chair count shown in UI
  count = 0;

  // limits
  min = 0;
  step = 2;

  constructor(designManager: DesignManager) {
    this.designManager = designManager;

    makeAutoObservable(this, {}, { autoBind: true });

    // Keep count within max limit
    reaction(
      () => this.max,
      (newMax) => {
        if (this.count > newMax) {
          this.count = newMax;
        }
      }
    );
  }

  // increase chair count
  increase() {
    this.count = Math.min(this.max, this.count + this.step);
  }

  // decrease chair count
  decrease() {
    this.count = Math.max(this.min, this.count - this.step);
  }

  // computed max chairs based on shape and length
  get max() {
    const shape =
      this.designManager.tableTopManager.selectedTableTop;

    const length =
      this.designManager.dimensionManager.topLength;

    // Round & Square limit
    if (shape === "round" || shape === "square") {
      return 8;
    }

    // Rectangular / capsule logic
    if (length <= 1200) return 4;
    if (length <= 1800) return 6;
    if (length <= 2300) return 8;
    if (length <= 2900) return 10;

    return 12;
  }
}
