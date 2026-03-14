import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LearnAI from "./learn-ai.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LearnAI />
  </StrictMode>
);
