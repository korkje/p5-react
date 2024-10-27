import React, { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch<{
    value: number,
    w: number,
    h: number,
}> = p => {
    p.setup = () => p.createCanvas(p.props.w, p.props.h);

    p.update = ({ w, h }) => {
        if (w !== p.props.w || h !== p.props.h) {
            p.resizeCanvas(w, h);
        }
    };

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Props", 0, 0);
        p.text(p.props.value, 0, 50);
    };


};

const Props = () => {
    const [width, setWidth] = useState(300);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const handle = setInterval(() => {
            setValue(ps => (ps + 1) % 10);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    useEffect(() => {
        if (value % 2 === 0) {
            setWidth(300);
        } else {
            setWidth(250);
        }
    }, [value]);

    return (
        <P5React
            sketch={sketch}
            props={{
                value,
                w: width,
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
