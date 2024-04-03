const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

const v1Router = require('./routes/index.js');
app.use('/v1', v1Router);

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
