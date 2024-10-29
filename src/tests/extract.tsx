import { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch<{
    size: {
        w: number;
        h: number;
    };
}> = p => {
    p.setup = () => p.createCanvas(p.props.size.w, p.props.size.h);

    let updates = 0;
    let resizes = 0;

    p.effect((_, initial) => {
        if (!initial) ++updates;
    });

    p.effect(({ size }, initial) => {
        if (!initial) {
            p.resizeCanvas(size.w, size.h);
            ++resizes;
        }
    }, ({ size }) => [size.w, size.h]);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Extract", 0, 0);
        p.textSize(16);
        p.text(`Updates: ${updates}`, 0, 50);
        p.text(`Resizes: ${resizes}`, 0, 75);
    };
};

const Extract = () => {
    const [_, setValue] = useState(0);

    useEffect(() => {
        const handle = setInterval(() => {
            setValue(ps => (ps + 1) % 10);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    const size = {
        w: 300,
        h: 100,
    };

    return (
        <P5React
            sketch={sketch}
            props={{ size }}
            style={{
                width: "fit-content",
                border: "1px dashed red",
            }}
        />
    );
};

export default Extract;
