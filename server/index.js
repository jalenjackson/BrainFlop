const express = require('express');
const next = require('next');

const PORT = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/api/shows', (req, res) => {
      return res.end('We made it!!!!!!')
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> BrainFlop Ready On Port ${PORT}`)
    })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  })
});
