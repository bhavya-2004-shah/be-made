import { makeAutoObservable } from "mobx";

export class ChairColorManager {
  colors: any[] = [];
  selectedChairColor: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setColors(colors: any[]) {
    this.colors = colors;

    // select first color by default
    if (colors.length > 0) {
      this.selectedChairColor = colors[0];
    } else {
      this.selectedChairColor = null;
    }
  }

  setSelectedChairColor(color: any) {
    this.selectedChairColor = color;
   
  }
}
