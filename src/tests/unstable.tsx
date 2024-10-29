import { useEffect, useMemo, useState } from "react";
import P5React, { Sketch } from "../lib";

const Unstable = () => {
    const [value, setValue] = useState(0);
    const [s, setS] = useState(0);

    const sketch = useMemo((): Sketch<{ value: number }> => p => {
        p.setup = () => p.createCanvas(300, 100);

        let _value: string | number = "(...)";

        p.effect(({ value }) => {
            _value = value;
        });

        p.draw = () => {
            p.background(255);
            p.textSize(32);
            p.textAlign(p.LEFT, p.TOP);
            p.text("Unstable", 0, 0);
            p.text(p.props.value, 0, 50);
            p.text(_value, 100, 50);
        };
    }, [s]);

    useEffect(() => {
        const handle = setInterval(() => {
            setValue(ps => (ps + 1) % 10);
        }, 1000);

        return () => clearInterval(handle);
    }, []);

    useEffect(() => {
        const handle = setInterval(() => {
            setS(ps => (ps + 1) % 2);
        }, 1618);

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

export default Unstable;
