
import "@fontsource-variable/plus-jakarta-sans";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { RecorderProvider } from "./providers/recorder-provider.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";

import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <BrowserRouter>
      <RecorderProvider>
        <App />
        <Analytics />
      </RecorderProvider>
    </BrowserRouter>
  </ThemeProvider>
);
