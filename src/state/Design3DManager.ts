import { makeAutoObservable, reaction } from "mobx";
import { StateManager } from "./StateManager";
import { MeshManager } from "./MeshManager";


export class Design3DManager {
  stateManager: StateManager;
  meshManager: MeshManager;

  constructor(stateManager: StateManager) {
   
    this.stateManager = stateManager;
    this.meshManager = new MeshManager();
  

    makeAutoObservable(this);

    
    reaction(
      () => this.stateManager.designManager.baseShapeManager.selectedBaseShape,
      (baseShape) => {
        console.log("Design3DManager received shape:", baseShape);
        if (baseShape) {
          this.meshManager.setBaseShapeModelUrl(baseShape.model);
        console.log("Design3DManager model received shape:", baseShape.model);

        }
      }
    );
  }
}
