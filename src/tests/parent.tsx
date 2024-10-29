import P5React, { Sketch } from "../lib";

const sketch: Sketch = (p, parent) => {
    const { clientWidth: w, clientHeight: h } = parent;

    p.setup = () => p.createCanvas(w, h);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Parent", 0, 0);
    };
};

const Parent = () => (
    <P5React
        sketch={sketch}
        style={{
            border: "1px dashed red",
            width: "300px",
            height: "100px",
        }}
    />
);

export default Parent;
