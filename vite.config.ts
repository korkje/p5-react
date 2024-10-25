import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/lib.tsx"),
            fileName: "lib",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "p5"],
        },
    },
    plugins: [react(), dts({ include: "src/lib.tsx" })],
});
