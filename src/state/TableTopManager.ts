import { makeAutoObservable } from "mobx";
import { DesignManager } from "./DesignManager";
import type { TableTopInfoJson } from "../types";

export class TableTopManager {
  designManager: DesignManager;

  // store only id
  selectedTableTop: string | null = null;
  tableTopJson: TableTopInfoJson[] | null = null;
   // 🔹 NEW: allowed shapes from base
  allowedShapes: string[] = [];
  
  constructor(designManager: DesignManager) {
      this.designManager = designManager;
      makeAutoObservable(this);
    }
    
    setSelectedTableTop(id: string) {
        this.selectedTableTop = id;
        
  if (!this.tableTopJson) return;

  const selected = this.tableTopJson.find((t) => t.id === id);
  if (selected?.modelUrl && selected?.modelMdfUrl) {
    this.designManager.stateManager.design3DManager.meshManager.setSelectedTopShapeModelUrl(selected.modelUrl , selected.modelMdfUrl);
  }
  
    }
    
    setTableTopJson(data: TableTopInfoJson[]) {
        this.tableTopJson = data;
        
        
        if (data.length > 0) {
            this.setSelectedTableTop(data[0].id);
            
        }
    }

      setAllowedShapes(shapes: string[]) {
    this.allowedShapes = shapes;

    // if current selection is not allowed → switch to first allowed
    if (
      this.selectedTableTop &&
      !shapes.includes(this.selectedTableTop)
    ) {
      const filtered = this.filteredTableTops;
      const first = filtered ? filtered[0] : null;
      if (first) {
        this.setSelectedTableTop(first.id);
      }
    }
  }
    
    get tableTops() {
        this.tableTopData();
        return this.tableTopJson;
    }

      get filteredTableTops(): TableTopInfoJson[] | null {
    if (!this.tableTopJson) return null;

    if (this.allowedShapes.length === 0) {
      return this.tableTopJson;
    }

    return this.tableTopJson.filter((top) =>
      this.allowedShapes.includes(top.id)
    );
  }
    
    // get full selected object
    get selectedTableTopData(): TableTopInfoJson | null {
        if (!this.tableTopJson || !this.selectedTableTop) return null;
        
        return (
            this.tableTopJson.find(
               
                (item) => item.id === this.selectedTableTop
            ) || null
        );
    }
    
    async tableTopData() {
        if (this.tableTopJson != null) return;
        
    const res = await fetch("/tops.json");
    const data = await res.json();
    this.setTableTopJson(data);
  }
}
