import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";

export class PricingManager {
  designManager: DesignManager;

  constructor(designManager: DesignManager) {
    this.designManager = designManager;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // ----------------------------
  // TABLE PRICE
  // ----------------------------
  get tablePrice(): number {
    const shape =
      this.designManager.tableTopManager.selectedTableTop
console.log(shape)
    const length =
      this.designManager.dimensionManager.topLength
      console.log(length)

    // ---------------- RECTANGULAR ----------------
    if (shape === "capsule" || shape === "rectangle" || shape === "oval" || shape === "oblong") {
      if (length >= 1600 && length <= 2200) return 2880;
      if (length >= 2250 && length <= 2450) return 3312;
      if (length >= 2500 && length <= 2850) return 3576;
      if (length >= 2900 && length <= 3200) return 3840;
    }

    // ---------------- SQUARE ----------------
    if (shape === "square") {
      if (length === 1200) return 2190;
      if (length === 1300) return 2380;
      if (length === 1400) return 2650;
      if (length === 1500) return 2880;
      if (length === 1580) return 2880;
    }

    // ---------------- ROUND ----------------
    if (shape === "round") {
      if (length === 1200) return 2290;
      if (length === 1300) return 2480;
      if (length === 1400) return 2750;
      if (length === 1500) return 2980;
      if (length === 1580) return 2980;
    }

    return 0;
  }

  // ----------------------------
  // CHAIR PRICE
  // ----------------------------
  get chairPrice(): number {
    const chairCount =
      this.designManager.chairCountManager.count;

    const pricePerChair = 100;

    return chairCount * pricePerChair;
  }

  // ----------------------------
  // TOTAL PRICE
  // ----------------------------
  get totalPrice(): number {
    return this.tablePrice + this.chairPrice;
  }
}
