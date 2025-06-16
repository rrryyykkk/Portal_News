import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Authprovider from "./provider/AuthProvider.jsx";

// swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Authprovider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Authprovider>
    </BrowserRouter>
  </StrictMode>
);
