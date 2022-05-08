const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(`${__dirname}/wwww`));

app.get('/*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/wwww/index.html`));
});

app.listen(process.env.PORT || 4200);
