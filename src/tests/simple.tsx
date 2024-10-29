import React from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch = p => {
    p.setup = () => p.createCanvas(300, 100);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Simple", 0, 0);
    };
};

const Simple: React.FC = () => (
    <P5React
        sketch={sketch}
        style={{
            width: "fit-content",
            border: "1px dashed red",
        }}
    />
);

export default Simple;
