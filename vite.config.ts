import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/lib.tsx"),
            name: "P5React",
            fileName: "lib",
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "p5"],
            output: {
                globals: {
                    react: "React",
                    p5: "p5",
                },
            },
        },
    },
    plugins: [react(), dts({ include: "src/lib.tsx" })],
});
