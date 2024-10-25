import React from "react";
import { createRoot } from "react-dom/client";
import P5React, { Sketch } from "./lib";

const sketch: Sketch = (p5) => {
    let value = 0;

    const handle = setInterval(() => {
        ++value;
    }, 1000);

    p5.setup = (parent) => {
        p5.createCanvas(parent.clientWidth, parent.clientHeight);
        p5.background(255);
    };

    p5.draw = () => {
        p5.background(255);
        p5.textSize(32);
        p5.translate(p5.width / 2, p5.height / 2);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(value, 0, 0);
    };

    return () => clearInterval(handle);
};

const App: React.FC = () => (
    <P5React
        sketch={sketch}
        style={{
            width: "100px",
            height: "100px",
            border: "1px dashed red",
        }}
    />
);

createRoot(document.getElementById("root")!).render(<App />);
