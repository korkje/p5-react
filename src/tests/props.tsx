import { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch<{
    value: number,
    w: number,
    h: number,
}> = p => {
    p.setup = () => p.createCanvas(p.props.w, p.props.h);

    let resizes = 0;

    p.effect(({ w, h }, initial) => {
        if (!initial) {
            p.resizeCanvas(w, h);
            ++resizes;
        }
    }, ["w", "h"]);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Props", 0, 0);
        p.textSize(16);
        p.text(`Resizes: ${resizes}`, 0, 50);
        p.text(`Value: ${p.props.value}`, 0, 75);
    };
};

const SIZES = [250, 300];

const Props = () => {
    const [widthI, setWidthI] = useState(0);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const handle = setInterval(() => {
            setValue(ps => (ps + 1) % 10);
        }, 250);

        return () => clearInterval(handle);
    }, []);

    useEffect(() => {
        const handle = setInterval(() => {
            setWidthI(ps => (ps + 1) % SIZES.length);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    return (
        <P5React
            sketch={sketch}
            props={{
                value,
                w: SIZES[widthI],
                h: 100,
            }}
            style={{
                width: "fit-content",
                border: "1px dashed red",
            }}
        />
    );
};

export default Props;
