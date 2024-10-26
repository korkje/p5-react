import React, { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch = p => {
    let value = 0;

    const handle = setInterval(() => ++value, 1000);

    p.setup = () => p.createCanvas(300, 100);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Cleanup", 0, 0);
        p.text(value, 0, 50);
    };

    return () => clearInterval(handle);
};

const Cleanup = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (show) {
            const handle = setTimeout(() => {
                setShow(false);
            }, 5000);

            return () => clearTimeout(handle);
        }

        setShow(true);
    }, [show]);

    return show && (
        <P5React
            sketch={sketch}
            style={{
                width: "fit-content",
                border: "1px dashed red",
            }}
        />
    );
};

export default Cleanup;
