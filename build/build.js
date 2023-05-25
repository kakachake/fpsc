const path = require("path");

const esbuildConig = () =>
  require("esbuild").buildSync({
    entryPoints: [path.resolve(__dirname, "../index.ts")],
    bundle: true,
    outdir: path.resolve(__dirname, "../dist"),
    platform: "node",
  });

esbuildConig();
