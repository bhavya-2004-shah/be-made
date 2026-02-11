import { makeAutoObservable } from "mobx";
import { StateManager } from "./StateManager";
// import { ViewManager } from "./ViewManager";
import { BaseShapeManager } from "./BaseShapeManager";
import { BaseColorManager } from "./BaseColorManager";
import { TableTopManager } from "./TableTopManager";
import { TableTextureManager } from "./TableTextureManager";
import { DimensionManager } from "./DimensionManager";
import { ChairManager } from "./ChairManager";
import { ChairColorManager } from "./ChairColorManager";
import { ChairCountManager } from "./ChairCountManager";
import { PricingManager } from "./PricingManager";
import type { CameraViewType } from "../Components/Viewer3D/Camera/cameraConfig";


export class DesignManager {
  stateManager: StateManager;
  baseShapeManager: BaseShapeManager;
  baseColorManager : BaseColorManager;
  tableTopManager : TableTopManager;
  tableTextureManager : TableTextureManager;
  dimensionManager: DimensionManager;
  chairManager : ChairManager
  chairColorManager : ChairColorManager 
  chairCountManager: ChairCountManager;
  pricingManager: PricingManager;
  cameraView: CameraViewType = "rightSide";


  constructor(stateManager: StateManager) {
    this.stateManager = stateManager;

    // this.viewManager = new ViewManager(this);
    this.baseShapeManager = new BaseShapeManager(this);
    this.baseColorManager = new BaseColorManager()
    this.tableTopManager = new TableTopManager(this);
    this.tableTextureManager = new TableTextureManager(this);
    this.dimensionManager = new DimensionManager(this);
    this.chairManager = new ChairManager(this)
    this.chairColorManager = new ChairColorManager();
     this.chairCountManager = new ChairCountManager(this);
     this.pricingManager = new PricingManager(this);


    makeAutoObservable(this);
  }

  setCameraView(view: CameraViewType) {
    this.cameraView = view;
  }
}
