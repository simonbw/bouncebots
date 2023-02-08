import autoprefixer from "autoprefixer";
import esbuild from "esbuild";
import postcssPlugin from "esbuild-postcss";
import tailwind from "tailwindcss";
import postcssImport from "postcss-import";

const isDev = process.argv.some((arg) => arg == "--watch");

await esbuild
  .build({
    entryPoints: ["src/index.tsx", "src/styles/index.css"],
    bundle: true,
    minify: !isDev,
    sourcemap: true,
    outdir: "dist",
    plugins: [
      postcssPlugin({
        postcss: {
          plugins: [postcssImport, tailwind, autoprefixer],
        },
      }),
    ],
  })
  .catch(() => {
    console.error(`Build error: ${error}`);
    process.exit(1);
  });
