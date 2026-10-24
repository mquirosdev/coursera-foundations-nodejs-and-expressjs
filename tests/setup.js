import mongoose from 'mongoose';

import { beforeAll, afterAll, aroundEach } from 'vitest';

mongoose.set('transactionAsyncLocalStorage', true);

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`)
});

afterAll(async () => {
  await mongoose.disconnect();
});

aroundEach(async (testFn) => {
  const rollbackSignal = new Error('Rollback test transaction');

  try {
    await mongoose.connection.transaction(async () => {
      await testFn();
      throw rollbackSignal;
    });
  } catch (error) {
    if (error !== rollbackSignal) {
      throw error;
    }
  }
});
