import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            className: "custom-toast",
            style: {
              background: "transparent",
              boxShadow: "none",
              padding: 0,
              margin: 0,
            },
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
