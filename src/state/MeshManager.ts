import { makeAutoObservable } from "mobx";
import type { TableTopColorJson } from "../types";


export class MeshManager {
baseShapeModelUrl : string | null = null
selectedBaseColor : string | null = null
topShapeModelUrl : string|null=null
topShapeMdfUrl : string | null = null 
selectedTexture : TableTopColorJson | null = null
chairShapeModelUrl : string | null = null 
selectedChairColor : any = null 
constructor() {
  makeAutoObservable(this)
}

  setBaseShapeModelUrl(url: string){
    this.baseShapeModelUrl = url
    console.log("url" , url)
  }
 
    setSelectedBaseColor(color: string) {
    this.selectedBaseColor = color;
    console.log("Selected Base Color:", color);
  }
  
  setSelectedTopShapeModelUrl(topUrl:string , mdfUrl:string){
    this.topShapeModelUrl = topUrl 
    this.topShapeMdfUrl = mdfUrl
    console.log("tableshape" , topUrl)
    console.log("tableshape MDf" , mdfUrl)
  }

  setSelectedTexture(texture : TableTopColorJson) { 
    this.selectedTexture = texture
  }
  setChairShapeModelUrl(url: string){
    this.chairShapeModelUrl = url
    console.log("url chair" , url)
  }

   setSelectedChairColor(color: string) {
    this.selectedChairColor = color;
    console.log("Selected Chair Color:", color);
  }
    
  }
