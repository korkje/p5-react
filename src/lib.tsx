import React, { useEffect, useRef } from "react";
import P5 from "p5";

export type Extras<T> = {
    parent: HTMLDivElement;
    props: {} extends T ? undefined : T;
    update: (props: Extras<T>["props"]) => void;
    effect: (
        callback: (props: Extras<T>["props"], initial: boolean) => void,
        deps?: (keyof T)[],
    ) => void;
};

export type Sketch<T = {}> = (p: P5 & Extras<T>, parent: HTMLDivElement) => unknown;

export type Props<T> =
    ({ sketch: Sketch<T> } & ({} extends T ? { props?: never }: { props: T | [T, unknown[]] }))
    & React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;

export const P5React = <T extends {}>({ sketch, props, ...rest}: Props<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const updateRef = useRef<Extras<T>["update"]>();
    const effectsRef = useRef<Parameters<Extras<T>["effect"]>[]>([]);
    const initialRef = useRef<boolean>(true);
    const cleanupRef = useRef<Function>();
    const prevPropsRef = useRef<T>();

    const [PROPS, DEPS] = props === undefined
        ? [undefined, []] : Array.isArray(props)
            ? props : [props, Object.values(props)];

    const prevProps = prevPropsRef.current;
    prevPropsRef.current = PROPS;

    useEffect(() => {
        const wrapper = new P5((p: P5 & Extras<T>) => {
            p.parent = parentRef.current!;
            p.props = PROPS as Extras<T>["props"];
            p.effect = (callback, deps) => {
                effectsRef.current.push([callback, deps]);
            };
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
            updateRef.current = undefined;
            effectsRef.current = [];
            initialRef.current = true;
            cleanupRef.current = undefined;
            prevPropsRef.current = undefined;
        };
    }, [sketch]);

    useEffect(() => {
        for (const [callback, deps] of effectsRef.current) {
            if (deps?.some(dep => PROPS![dep] !== prevProps?.[dep]) ?? true) {
                callback(PROPS as Extras<T>["props"], initialRef.current);
            }
        }

        if (initialRef.current) {
            initialRef.current = false;
        }
        else {
            updateRef.current?.(PROPS as Extras<T>["props"]);
        }
    }, [sketch, ...DEPS]);

    return <div ref={parentRef} {...rest} />;
};

export default P5React;
