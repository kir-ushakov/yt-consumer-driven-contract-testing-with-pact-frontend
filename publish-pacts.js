const pact = require('@pact-foundation/pact-node');
const dotenv = require('dotenv');
const path = require('path');
const packageJson = require('./package.json');

let projectFolder = __dirname;
const pathToEnvVars = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: pathToEnvVars });

const opts = {
  pactBroker: process.env.PACT_BROKER_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  pactFilesOrDirs: [projectFolder + '/pacts'],
  consumerVersion: packageJson.version,
  tags: ['latest']
}

pact.publishPacts(opts)
  .then(() => {
    console.log(`Pact contracts were successfully published on ${process.env.PACT_BROKER_URL}`);
})
