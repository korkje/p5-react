import React, { memo, useEffect, useRef } from "react";
import P5 from "p5";

export type Sketch = (p5: P5, parent: HTMLElement) => unknown;

export type Props = { sketch: Sketch } &
    React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;

export const P5React: React.FC<Props> = memo(({ sketch, ...rest }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<Function>();

    useEffect(() => {
        const wrapper = new P5((p5: P5) => {
            const result = sketch(p5, parentRef.current!);
            if (typeof result === "function") {
                cleanupRef.current = result;
            }
        }, parentRef.current!);

        return () => {
            wrapper.remove()
            cleanupRef.current?.();
        };
    }, [sketch]);

    return <div ref={parentRef} {...rest} />;
});

export default P5React;
