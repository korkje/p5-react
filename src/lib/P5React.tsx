import React, { memo, useEffect, useRef } from "react";
import _P5 from "p5";

export type Setup = (parent: HTMLElement) => void;
export type P5 = Omit<_P5, "setup"> & { setup: Setup };
export type Sketch = (p5: P5) => unknown;

export type Props = { sketch: Sketch } &
    React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;

export const P5React: React.FC<Props> = memo(({ sketch, ...rest }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<Function>();

    useEffect(() => {
        const wrapper = new _P5((p5: _P5) => {
            const result = sketch(p5);
            if (typeof result === "function") {
                cleanupRef.current = result;
            }
            const setup = p5.setup as Setup;
            p5.setup = () => setup(parentRef.current!);
        }, parentRef.current!);

        return () => {
            wrapper.remove()
            cleanupRef.current?.();
        };
    }, [sketch]);

    return <div ref={parentRef} {...rest} />;
});

export default P5React;
