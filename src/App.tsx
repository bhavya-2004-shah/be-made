import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MainContextProvider } from "./context/MainContextProvide";
import { MainLayout } from "./layout/Mainlayout";
import { PlaceOrderSummary } from "./Components/Viewer/PlaceOrderSummary";

export const App = observer(() => {
  return (
    <BrowserRouter>
      <MainContextProvider>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/place-order" element={<PlaceOrderSummary />} />
        </Routes>
      </MainContextProvider>
    </BrowserRouter>
  );
});
