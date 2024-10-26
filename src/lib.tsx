import React, { useEffect, useRef } from "react";
import P5 from "p5";

export type Extras<T> = { parent: HTMLDivElement, update: (props: {} extends T ? undefined : T) => void };
export type Sketch<T = {}> = (p: P5 & Extras<T>, parent: HTMLDivElement) => unknown;

export type Props<T> =
    ({ sketch: Sketch<T> } & ({} extends T ? { props?: undefined }: { props: T | [T, React.DependencyList] }))
    & React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;

export const P5React = <T extends {}>({ sketch, props, ...rest}: Props<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const updateRef = useRef<(props: any) => void>();
    const cleanupRef = useRef<Function>();

    useEffect(() => {
        const wrapper = new P5((p: P5 & Extras<T>) => {
            p.parent = parentRef.current!;
            const result = sketch(p, parentRef.current!);
            if (typeof result === "function") {
                cleanupRef.current = result;
            }
            updateRef.current = p.update;
        }, parentRef.current!);

        return () => {
            wrapper.remove()
            cleanupRef.current?.();
        };
    }, [sketch]);

    const [p, d] = props === undefined
        ? [undefined, []] : Array.isArray(props)
            ? props : [props, Object.values(props)];

    useEffect(() => {
        updateRef.current?.(p);
    }, d);

    return <div ref={parentRef} {...rest} />;
};

export default P5React;
