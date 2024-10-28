import React from "react";
import { createRoot } from "react-dom/client";

import Cleanup from "./examples/cleanup";
import Deps from "./examples/deps";
import Parent from "./examples/parent";
import Props from "./examples/props";
import Simple from "./examples/simple";
import Effect from "./examples/effect";

const App: React.FC = () => (
    <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    }}>
        <Simple />
        <Parent />
        <Cleanup />
        <Props />
        <Deps />
        <Effect />
    </div>
);

createRoot(document.getElementById("root")!).render(<App />);
