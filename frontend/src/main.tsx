import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Chỉ dùng đúng 1 lần render và bọc App lại luôn ở đây
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="873719481740-gq87v3njcd76ga4oguvgsu55grth9lbi.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);