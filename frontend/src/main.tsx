import React from "react";
import { createRoot } from "react-dom/client"; 
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes"; // Import router bạn đã định nghĩa
import "./styles/index.css"; 
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="873719481740-gq87v3njcd76ga4oguvgsu55grth9lbi.apps.googleusercontent.com">
      {/* Navbar và mọi thứ khác đều phải nằm trong RouterProvider thông qua App component */}
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);