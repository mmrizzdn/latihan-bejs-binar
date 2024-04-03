const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const file = fs.readFileSync('./api-docs.yaml', 'utf-8');
const swaggerDocument = YAML.parse(file);

app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

const v1 = require('./routes/v1/index');
app.use('/v1', v1);

app.listen(port, () => {
    console.log('app listening on port', port);
});
