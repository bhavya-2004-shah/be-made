
import { BaseColorViewer } from "./Viewer/BaseColorViewer";
import { BaseShapeViewer } from "./Viewer/BaseShapeViewer";
import { ChairColorViewer } from "./Viewer/ChairColorViewer";
import { ChairCountViewer } from "./Viewer/ChairCountViewer";
import { ChairShapeViewer } from "./Viewer/ChairShapeViewer";
import { DimensionsViewer } from "./Viewer/DimensionsViewer";
import { OrderSummaryViewer } from "./Viewer/OrderSummaryViewer";
import { TableTextureViewer } from "./Viewer/TableTextureViewer";
import { TableTopViewer } from "./Viewer/TableTopViewer";

export const Viewer = () => {
  return<>
  <BaseShapeViewer />;
<BaseColorViewer/>
<TableTextureViewer/>
<TableTopViewer/>
<DimensionsViewer/>
<ChairShapeViewer/>
<ChairColorViewer/>
<ChairCountViewer/>
<OrderSummaryViewer/>
  </> 
}; 
 