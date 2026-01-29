import { createRoot } from "react-dom/client";
import { Main } from "./components/Main";

const container = document.getElementById("react-container");
if (!container) throw new Error("Failed to find the react-container element");

const root = createRoot(container);
root.render(<Main />);
