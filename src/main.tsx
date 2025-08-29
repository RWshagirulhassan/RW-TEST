import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { RTIContextProvider } from "./context/RTIcontext.tsx";
import RiskProfileTest from "./page/RiskProfile.tsx";
import RTITest from "./page/RTITest.tsx";
import RiskAppetite from "./page/RiskAppetite.tsx";
import RTIReport from "./page/RTIReport.tsx";
import { ModalProvider } from "./context/model.tsx";
import Home from "./page/Home/index.tsx";
import { CalculatorProvider } from "./page/Home/Calculator/context/calculatorContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <CalculatorProvider>
        <RTIContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/RTI" element={<RTITest />} />
              <Route path="/RISK-PROFILE" element={<RiskProfileTest />} />
              <Route path="/RETIREMENT-CAL" element={<Home />} />
              <Route path="/RISK-APPETITE" element={<RiskAppetite />} />
              <Route path="/RTI-REPORT" element={<RTIReport />} />
            </Routes>
          </BrowserRouter>
        </RTIContextProvider>
      </CalculatorProvider>
    </ModalProvider>
  </StrictMode>
);
