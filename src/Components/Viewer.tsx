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
  return (
    <>
      <section id="section-base" data-nav-section="base">
        <BaseShapeViewer />
      </section>

      <section id="section-base-color" data-nav-section="base-color">
        <BaseColorViewer />
      </section>

      <section id="section-top-color" data-nav-section="top-color">
        <TableTextureViewer />
      </section>

      <section id="section-top-shape" data-nav-section="top-shape">
        <TableTopViewer />
      </section>

      <section id="section-dimension" data-nav-section="dimension">
        <DimensionsViewer />
      </section>

      <section id="section-chair-shape" data-nav-section="chair">
        <ChairShapeViewer />
      </section>

      <section id="section-chair-color" data-nav-section="chair">
        <ChairColorViewer />
      </section>

      <section id="section-chair-count" data-nav-section="chair">
        <ChairCountViewer />
      </section>

      <section id="section-summary" data-nav-section="summary">
        <OrderSummaryViewer />
      </section>
    </>
  );
};
