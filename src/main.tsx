import React from "react";
import { createRoot } from "react-dom/client";

import Cleanup from "./tests/cleanup";
import Parent from "./tests/parent";
import Props from "./tests/props";
import Simple from "./tests/simple";
import Unstable from "./tests/unstable";
import Deps from "./tests/deps";
import Extract from "./tests/extract";

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
        <Extract />
        <Unstable />
    </div>
);

createRoot(document.getElementById("root")!).render(<App />);
