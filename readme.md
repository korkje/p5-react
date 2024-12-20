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

`P5React` supports passing props into the sketch. For TypeScript users, props are defined as a type argument to the `Sketch` type, and they are made available on the p5.js instance as `p.props`.

```jsx

const sketch: Sketch<{
    count: number;
    w: number;
    h: number;
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

### Effect

Similar to React's `useEffect`, you can use `p.effect` to run code when props change (and initially). The first argument is a function that takes in the new props object and an `initial` flag (which is `true` on the first run), and the second argument is an optional array of dependencies (keys of the props object).

```jsx
const sketch: Sketch<{
    count: number;
    w: number;
    h: number;
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

The second argument may also be a function that takes in the new props object and returns an array of dependencies, if you are so inclined.

```jsx
const sketch: Sketch<{
    arr: number[];
}> = p => {
    p.setup = () => p.createCanvas(100, 100);

    p.effect(({ arr }) => {
        console.log(`Array length: ${arr.length}`);
    }, ({ arr }) => [arr.length]);
};
```

Note that on subsequent runs, `p.props` will only be updated after all effects have run. This means that in your effects, you can access both new and old props, if needed.

### Dependencies

By default, props are updated when any of the prop values change according to shallow comparison, in fact `Object.values` is used to create a dependency array for the internal `useEffect` hook that updates props (and runs effects).

You may alter this behavior by supplying a `deps` array to the `P5React` component. This array will be passed to the internal `useEffect` hook instead of the prop values.

This could be useful if you e.g. are creating and passing object props, and only want to update when a specific property of the object changes, though I would consider memoizing the object in that case.

```jsx
export default () => {
    const size = getSketchSize("my-sketch"); // { w: 100, h: 100 }

    return (
        <P5React
            sketch={sketch}
            props={{ size }}
            deps={[size.w, size.h]}
        />
    );
};
```

Using memoization, the deps array could be omitted.

```jsx
export default () => {
    const size = useMemo(() => getSketchSize("my-sketch"), []);

    return <P5React sketch={sketch} props={{ size }} />;
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
