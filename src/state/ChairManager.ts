import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";
import type { ChairsInfoJson } from "../types";

export class ChairManager {
  designManager: DesignManager;
  selectedChair: ChairsInfoJson | null = null;
  chairsInfoJson: ChairsInfoJson[] | null = null;
  selectedColor: any = null;

  constructor(designManager: DesignManager) {
    this.designManager = designManager;
    makeAutoObservable(this);
  }

  setSelectedChair(chair: ChairsInfoJson) {
    this.selectedChair = chair;

  this.designManager.chairColorManager.setColors(chair?.colors || []);

  this.designManager.stateManager.design3DManager.meshManager.chairShapeModelUrl = this.selectedChair.glbUrl
  }

  setSelectedColor(color: any) {
    this.selectedColor = color;
    console.log(this.selectedColor)
  }

  setchairsInfoJson(data: ChairsInfoJson[]) {
    this.chairsInfoJson = data;

    // select first chair by default
    if (data.length > 0) {
      this.setSelectedChair(data[0]);
    }
  }

  get chairShapes() {
    this.chairsShapeData();
    return this.chairsInfoJson;
  }

  async chairsShapeData() {
    if (this.chairsInfoJson != null) return;

    const res = await fetch("/chairs.json");
    const data = await res.json();
    this.setchairsInfoJson(data);
  }
}
