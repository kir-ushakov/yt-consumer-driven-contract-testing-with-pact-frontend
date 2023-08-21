import { provider } from './provider';

afterAll(async () => {
  await provider.finalize();
});
