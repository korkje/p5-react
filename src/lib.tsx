import React, { useEffect, useRef } from "react";
import P5 from "p5";

type SketchProps<T> = {} extends T ? undefined : T;
type Object = Record<string, unknown>;

export type Extras<T> = {
    parent: HTMLDivElement;
    props: SketchProps<T>;
    effect: (
        callback: (props: SketchProps<T>, initial: boolean) => void,
        deps?: (keyof T)[] | ((props: T) => unknown[]),
    ) => void;
};

export type Sketch<T extends Object = {}> = (p: P5 & Extras<T>, parent: HTMLDivElement) => unknown;

export type P5ReactProps<T extends Object> =
    { sketch: Sketch<T>; deps?: unknown[] }
    & ({} extends T ? { props?: undefined } : { props: T })
    & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const P5React = <T extends Object>({ sketch, props, deps, ...rest}: P5ReactProps<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const updateRef = useRef<(props: SketchProps<T>) => void>();
    const effectsRef = useRef<Parameters<Extras<T>["effect"]>[]>();
    const cleanupRef = useRef<Function>();
    const prevRef = useRef<[SketchProps<T>, unknown[]]>();

    const PROPS = props as SketchProps<T>;
    const DEPS = deps ?? (PROPS ? Object.values(PROPS) : []);

    useEffect(() => {
        const wrapper = new P5((p: P5 & Extras<T>) => {
            p.parent = parentRef.current!;
            p.props = PROPS;
            p.effect = (callback, deps) => effects.push([callback, deps]);
            const effects: Parameters<Extras<T>["effect"]>[] = [];
            const result = sketch(p, parentRef.current!);
            if (effects.length) effectsRef.current = effects;
            if (typeof result === "function") cleanupRef.current = result;
            updateRef.current = props => p.props = props;
        }, parentRef.current!);

        return () => {
            try { wrapper.remove(); }
            catch (e) { console.error("Failed to remove P5 instance", e); }
            try { cleanupRef.current?.(); }
            catch (e) { console.error("Cleanup function threw", e); }

            updateRef.current = undefined;
            effectsRef.current = undefined;
            cleanupRef.current = undefined;
            prevRef.current = undefined;
        };
    }, [sketch]);

    if (prevRef.current) {
        const [_ , prevDeps] = prevRef.current;
        if (DEPS.length !== prevDeps.length) {
            console.error("The 'props' object changed shape");
        }
    }

    useEffect(() => {
        const prev = prevRef.current;
        prevRef.current = [PROPS, DEPS];

        if (!prev) {
            effectsRef.current?.forEach(([callback]) => {
                try { callback(PROPS, true); }
                catch (e) { console.error("Effect callback threw", e); }
            });
            return;
        }

        const [prevProps] = prev;
        if (!PROPS || !prevProps || !effectsRef.current) {
            return;
        }

        effectsRef.current?.forEach(([callback, deps]) => {
            let run = false;
            try {
                if (typeof deps === "function") {
                    const _old = deps(prevProps);
                    const _new = deps(PROPS);
                    run = _old.some((v, i) => v !== _new[i]);
                }
                else {
                    run = deps?.some(dep => prevProps![dep] !== PROPS![dep]) ?? true;
                }
            }
            catch (e) { console.error("Dependency check threw", e); }

            if (run) {
                try { callback(PROPS, false); }
                catch (e) { console.error("Effect callback threw", e); }
            }
        });

        updateRef.current?.(PROPS);
    }, [sketch, ...DEPS]);

    return <div ref={parentRef} {...rest} />;
};

export default P5React;
