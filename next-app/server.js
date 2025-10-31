
const next = require('next');
const express = require('express');

const port = process.env.PORT || 3000;
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Avoid path-to-regexp parsing issues by using a middleware that forwards
  // every request to Next's handler without using a route pattern.
  server.use((req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});