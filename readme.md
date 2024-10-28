# p5-react

[![npm](https://img.shields.io/npm/v/@korkje/p5-react)](https://www.npmjs.com/package/@korkje/p5-react)
[![NPM](https://img.shields.io/github/license/korkje/p5-react)](license.md)

Simple [p5.js](https://p5js.org) wrapper for React.

```bash
npm add @korkje/p5-react
```

```jsx
import React from "react";
import P5React, { Sketch } from "@korkje/p5-react";

const sketch: Sketch = p => {
    p.setup = () => p.createCanvas(100, 100);
    p.draw = () => {
        p.background(0);
        p.ellipse(50, 50, 80, 80);
    };
};

export default () => <P5React sketch={sketch} />;
```

## Usage

For most use cases, you will find that this works just like normal p5.js in instance mode. However, there are some extra features and differences worth mentioning.

### Parent

The parent element of the canvas is passed to the sketch as the second argument. This can be useful, e.g. if you want the canvas to fill the parent element.

```jsx
const sketch: Sketch = (p, parent) => {
    p.setup = () => p.createCanvas(
        parent.clientWidth,
        parent.clientHeight,
    );
    // ...
};

export default () => <P5React
    sketch={sketch}
    style={{ width: "100px", height: "100px" }}
/>;
```

The parent element is also set on the p5.js instance, if you prefer to use that.

```jsx
const sketch: Sketch = p => {
    p.setup = () => p.createCanvas(
        p.parent.clientWidth,
        p.parent.clientHeight,
    );
    // ...
};
```

### Cleanup

When the `P5React` component is unmounted, the p5.js instance is automatically removed. But you might also want to clean up other resources on unmount, e.g. timers set in the sketch. You can do this by returning a cleanup function.

```jsx
const sketch: Sketch = p => {
    const handle = setInterval(() => {
        // ...
    }, 1000);

    return () => clearInterval(handle);
};
```

### Props

`P5React` supports passing props into the sketch. For TypeScript users, props are defined as a type argument to the `Sketch` type, which will allow props to be inferred by both `P5React`, the `props` object, and the `update`/`effect` functions (see below).

```jsx

const sketch: Sketch<{
    count: number,
    w: number,
    h: number,
}> = p => {
    p.setup = () => p.createCanvas(p.props.w, p.props.h);

    p.draw = () => {
        p.background(0);
        p.text(p.props.count, 50, 50);
    };
};

export default () => {
    const [count, setCount] = useState(0);

    return <>
        <P5React sketch={sketch} props={{ count, w: 100, h: 100 }} />
        <button onClick={() => setCount(ps => ps + 1)}>
            Increment
        </button>
    </>;
};
```

### Update

You may also define an `update` function that is called with the new props right before the `props` object changes (*not* on initial props). It is called before to allow you to check for changes and perform any necessary updates.

```jsx
const sketch: Sketch<{
    count: number,
    w: number,
    h: number,
}> = p => {
    p.setup = () => p.createCanvas(p.props.w, p.props.h);

    p.draw = () => {
        p.background(0);
        p.text(p.props.count, 50, 50);
    };

    p.update = ({ w, h }) => {
        if (w !== p.props.w || h !== p.props.h) {
            p.resizeCanvas(w, h);
        }
    };
};
```

### Effect

For a more React-like approach, you can register effect callbacks to be called when some subset of props change. This is done by calling `p.effect` with your callback and an optional dependency array (`props` keys). These deps function the same way as in React's `useEffect`, so leaving it out will cause the callback to be called on every prop change.

Like the `update` function, the effect callback is called right before the `props` object changes. However, it is also called with initial props (like `useEffect`). It receives the props, and a boolean indicating whether this is the initial call.

```jsx
const sketch: Sketch<{
    count: number,
    w: number,
    h: number,
}> = p => {
    p.setup = () => p.createCanvas(p.props.w, p.props.h);

    p.draw = () => {
        p.background(0);
        p.text(p.props.count, 50, 50);
    };

    p.effect(({ w, h }, initial) => {
        if (!initial) {
            p.resizeCanvas(w, h);
        }
    }, ["w", "h"]);
};
```

### Dependencies

When passing props to the sketch, you might not want to update the `props` object on every prop change. Much like with React's `useEffect`, you can supply a dependency array that is used to determine whether to update `props`, as well as call the `update` function and/or effect callbacks.

This is done by changing the props object to an array of `[props, deps]`. The `deps` array here is in turn used for the internal `useEffect` hook which executes the `update` function and effect callbacks.

```jsx
export default () => {
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);

    return <>
        <P5React
            sketch={sketch}
            props={[{ a, b }, [a]]} // Only update when `a` changes
        />
        <button onClick={() => setA(ps => ps + 1)}>
            Increment A
        </button>
        <button onClick={() => setB(ps => ps + 1)}>
            Increment B
        </button>
    </>;
};
```

### Memoization

The `P5React` component isn't memoized, but it should be very inexpensive if used correctly. It contains two `useEffect` hooks, one for creating the p5.js instance and one for updating props. The first is only run when the `sketch` prop changes, and the second is only run when any of the `props` (or `deps` if supplied) change.

### p5.sound

If you want to use `p5.sound`, be aware that it expects `p5` to be globally available *before* it is imported. You can achieve this by doing something like this:

```jsx
import p5 from "p5";
(window as any).p5 = p5;
await import("p5/lib/addons/p5.sound");
```
