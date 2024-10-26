import React, { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch<{ value: number }> = p => {
    let value: number;

    p.update = props => {
        value = props.value;
    };

    p.setup = () => p.createCanvas(300, 100);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Props", 0, 0);
        p.text(value, 0, 50);
    };
};

const Props = () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const handle = setInterval(() => {
            setValue(ps => (ps + 1) % 10);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    return (
        <P5React
            sketch={sketch}
            props={{ value }}
            style={{
                width: "fit-content",
                border: "1px dashed red",
            }}
        />
    );
};

export default Props;
