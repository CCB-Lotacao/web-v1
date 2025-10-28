import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { IntlProvider } from "react-intl";

const locale = "pt-BR";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {}
    <IntlProvider locale={locale} defaultLocale="pt-BR">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </StrictMode>
);
