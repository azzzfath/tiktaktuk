const app = require("./app");

const port = Number(process.env.PORT ?? 4000);

const server = app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
