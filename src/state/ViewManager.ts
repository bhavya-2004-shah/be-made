import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";

export class ViewManager {
  designManager: DesignManager;

  constructor(designManager: DesignManager) {
    this.designManager = designManager;
    makeAutoObservable(this);
  }
}
