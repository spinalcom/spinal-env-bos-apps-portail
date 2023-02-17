const port = 9070;

module.exports = {
  apps: [
    {
      name: `portail-applicatif-bos-${port}`,
      script: "node_modules/.bin/parcel",
      cwd: ".",
      args: `serve -p ${port} index.html micro-apps/*/index.html --dist-dir dist/`,
    },
  ],
};
