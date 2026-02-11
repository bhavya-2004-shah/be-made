import { makeAutoObservable } from "mobx";

export class BaseColorManager {
  colors: any[] = [];
  selectedBaseColor: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setColors(colors: any[]) {
    this.colors = colors;

    // select first color by default
    if (colors.length > 0) {
      this.selectedBaseColor = colors[0];
    } else {
      this.selectedBaseColor = null;
    }
  }

  setSelectedBaseColor(color: any) {
    this.selectedBaseColor = color;
  }
}
