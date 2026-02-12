import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";
import type { BaseInfoJson } from "../types";


export class BaseShapeManager {
  designManager: DesignManager;
  selectedBaseShape: any = null;
  baseInfoJson: BaseInfoJson[] | null = null;



  constructor(designManager: DesignManager) {
    this.designManager = designManager;
    makeAutoObservable(this);
  }

  setSelectedBaseShape(shape: any) {
    this.selectedBaseShape = shape;
    this.designManager.setCameraView("front");

    // Tell color manager to reset colors for this shape
    this.designManager.baseColorManager.setColors(shape?.colors || []);

    this.designManager.dimensionManager.setTopLength(
      this.designManager.dimensionManager.maxLength
    )

     this.designManager.dimensionManager.setTopWidth(
      this.designManager.dimensionManager.maxWidth
    )
      this.designManager.tableTopManager.setAllowedShapes(
      shape?.supportedTopShapes || []
    );
  }

  setbaseInfoJson(data: BaseInfoJson[]) {
    this.baseInfoJson = data;

    // select first shape by default
    if (data.length > 0) {
      this.setSelectedBaseShape(data[0]);
    }
  }

  get baseShapes() {
    this.baseShapeData();
    return this.baseInfoJson;
  }

  async baseShapeData() {
    if (this.baseInfoJson != null) return;

    const res = await fetch("/data.json");
    const data = await res.json();
    this.setbaseInfoJson(data);
  }
}
