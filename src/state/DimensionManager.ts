import { makeAutoObservable , reaction } from "mobx";
import { DesignManager } from "./DesignManager";


export class DimensionManager {
  designManager: DesignManager;

  topLength: number = 200;
  topWidth: number = 1200;

  constructor(designManager : DesignManager){
    this.designManager = designManager
    makeAutoObservable(this, 
        {} ,

        {autoBind : true}
    )

    reaction (
      () => this.topType,
      () => {
        this.topLength = this.maxLength;
        this.topWidth = this.maxWidth;
      }
    );
  }

  setTopLength(value:number){
    this.topLength = value
  }

  setTopWidth(value:number){
    this.topWidth = value
  }

  get topType() {
    return (
      this.designManager.tableTopManager.selectedTableTop
    )
  }
  
  get minLength() {
    if(!this.topType) return 1000 ; 
    
    if(this.topType === "square" || this.topType === "round") {
      return 1200;
    }
    return 1800;
  }
  
  get maxLength() {
    console.log("the bsae tupe is",this.topType)
    if(!this.topType) return    4000;
    if(this.topType === "square" || this.topType === "round") {return 1580};
    return 3200;
  }
  get minWidth() {
    if (!this.topType) return 600;

    if (this.topType === "square" || this.topType === "round") {
      return 1580;
    }

    return 800;
  }
  get maxWidth() {
    if (!this.topType) return 1600;

    if (this.topType === "square" || this.topType === "round") {
      return 1580;
    }

    return 1300;
  }
}
