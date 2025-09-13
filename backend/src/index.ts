import { app } from "./server.js";

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000;

app.listen({ port: PORT }, () => {
  console.log(`running server on ${PORT}.`);
});
