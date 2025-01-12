import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Room from "./Room.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BotPage from "./components/BotPage.jsx";
import Bot from "./Bot.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/game/:name/:roomId" element={<App />} />
        <Route path="/game/:name/bot-multiplayer" element={<Bot />} />
      </Routes>
    </BrowserRouter>
  </>
);
