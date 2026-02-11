import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";
import type { TableTopColorJson } from "../types";

export class TableTextureManager {
  designManager: DesignManager;


  selectedTexture: string | null = null;

  texturesJson: TableTopColorJson[] | null = null;

  constructor(designManager: DesignManager) {
    this.designManager = designManager;
    makeAutoObservable(this);
  }

  setSelectedTexture(id: string) {
    this.selectedTexture = id;

    this.designManager.stateManager.design3DManager.meshManager.selectedTexture = this.selectedTextureData
    console.log(this.selectedTexture)
  }

  setTexturesJson(data: TableTopColorJson[]) {
    this.texturesJson = data;
        console.log("seeing the data" ,data)


    // select first texture with className = Natural
    const natural = data.find(
      (item) => item.className.toLowerCase() === "natural"
    );

    if (natural) {
      this.setSelectedTexture(natural.id);
    } else if (data.length > 0) {
      // fallback to first item
      this.setSelectedTexture(data[0].id);
    }
  }

  get textures() {
    this.loadTextures();
    return this.texturesJson;
  }

  // full selected texture object
  get selectedTextureData(): TableTopColorJson | null {
    if (!this.texturesJson || !this.selectedTexture) return null;

    return (
      this.texturesJson.find(
        (item) => item.id === this.selectedTexture
      ) || null
    );
  }

  async loadTextures() {
    if (this.texturesJson != null) return;

    const res = await fetch("/topColors.json");
    const data = await res.json();
    this.setTexturesJson(data);
  }
}
