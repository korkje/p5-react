import { useEffect, useState } from "react";
import P5React, { Sketch } from "../lib";

const sketch: Sketch<{ a: number, b: number }> = p => {
    p.setup = () => p.createCanvas(300, 100);

    let a: number;
    let b: number;

    p.effect(props => {
        a = props.a;
        b = props.b;
    }, ["b"]);

    p.draw = () => {
        p.background(255);
        p.textSize(32);
        p.textAlign(p.LEFT, p.TOP);
        p.text("Effect", 0, 0);
        p.text(a, 0, 50);
        p.text(b, 50, 50);
    };
};

const Effect = () => {
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);

    useEffect(() => {
        const handle = setInterval(() => {
            setA(ps => (ps + 1) % 10);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    useEffect(() => {
        if (a % 2 === 0) {
            setB(a / 2);
        }
    }, [a]);

    return (
        <P5React
            sketch={sketch}
            props={{ a, b }}
            style={{
                width: "fit-content",
                border: "1px dashed red",
            }}
        />
    );
};

export default Effect;
