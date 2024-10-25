# p5-react

[![npm](https://img.shields.io/npm/v/@korkje/p5-react)](https://www.npmjs.com/package/@korkje/p5-react)
[![NPM](https://img.shields.io/github/license/korkje/p5-react)](license.md)

Simple [p5.js](https://p5js.org) wrapper for React.

```bash
npm add p5 @korkje/p5-react
npm add -D @types/p5
```

```jsx
import P5React, { Sketch } from "@korkje/p5-react";

const sketch: Sketch = (p5, parent) => {
    let value = 0;
    const handle = setInterval(() => ++value, 1000);

    p5.setup = () => {
        p5.createCanvas(parent.clientWidth, parent.clientHeight);
        p5.background(255);
    };

    p5.draw = () => {
        p5.background(255);
        p5.textSize(32);
        p5.translate(p5.width / 2, p5.height / 2);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(value, 0, 0);
    };

    return () => clearInterval(handle);
};

const App: React.FC = () => (
    <P5React
        sketch={sketch}
        style={{
            width: "100px",
            height: "100px",
            border: "1px dashed red",
        }}
    />
);
```
