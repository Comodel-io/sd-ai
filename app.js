import express from 'express'
import config from './config.js'
import cors from 'cors'

import v1Initialize from './routes/v1/initialize.js'
import v1Engines from './routes/v1/engines.js'
import v1EngineParameters from './routes/v1/engineParameters.js'
import v1EngineGenerate from './routes/v1/engineGenerate.js'

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true }));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

const authenticationKey = process.env.AUTHENTICATION_KEY;

if (authenticationKey) {
  app.use((req, res, next) => {
    if (!req.header('Authentication') || req.header('Authentication') !== authenticationKey) {
      return res.status(403).send({ "success": false, err: 'Unauthorized, please pass valid Authentication header.' });
    }
    next();
  });
}


app.use("/api/v1/initialize", v1Initialize);
app.use("/api/v1/engines", v1Engines);
app.use("/api/v1/engines/", v1EngineParameters); //:engine/parameters
app.use("/api/v1/engines/", v1EngineGenerate); //:engine/generate

app.listen(config.port, () => {
  console.log(`ai-proxy-service listening on port ${config.port}`);
});