import { PactWeb } from '@pact-foundation/pact-web';

const provider = new PactWeb({
  port: 1234,
  host: '127.0.0.1',
});

export { provider };
