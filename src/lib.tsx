import React, { useEffect, useRef } from "react";
import P5 from "p5";

export type Extras<T> = {
    parent: HTMLDivElement;
    props: {} extends T ? undefined : T;
    update: (props: Extras<T>["props"]) => void;
};

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

    const [PROPS, DEPS] = props === undefined
        ? [undefined, []] : Array.isArray(props)
            ? props : [props, Object.values(props)];

    useEffect(() => {
        updateRef.current?.(PROPS);
    }, DEPS);

    useEffect(() => {
        const wrapper = new P5((p: P5 & Extras<T>) => {
            p.parent = parentRef.current!;
            p.props = PROPS as Extras<T>["props"];
            const result = sketch(p, parentRef.current!);
            if (typeof result === "function") {
                cleanupRef.current = result;
            }
            updateRef.current = props => {
                p.update?.(props);
                p.props = props as Extras<T>["props"];
            };
        }, parentRef.current!);

        return () => {
            wrapper.remove();
            cleanupRef.current?.();
            cleanupRef.current = undefined;
            updateRef.current = undefined;
        };
    }, [sketch]);

    return <div ref={parentRef} {...rest} />;
};

export default P5React;
