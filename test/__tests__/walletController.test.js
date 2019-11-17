'use strict';

const wallet = require('../../controllers/walletController.js');
const db = require ('../../models');

describe('createWallet', () => {

  let ctx1 = {
    request: {
      body: {
        alias: null
      }
    }
  };
  
  let ctx2 = {
    request: {
      body: {
        alias: 'henry'
      }
    },
    user: {
      username: 'henry'
    }
  };
  
  test('create wallet with no alias should return body', async () => {
    await expect(wallet.createWallet(ctx1)).resolves.toBe(ctx1.body);
  });
  test('create wallet should appear in the database', async () => {
    await wallet.createWallet(ctx2);
    const walletList = await db.Wallet.findAll({ where: { alias: 'henry' } });
    console.log(walletList);
    expect(walletList).toBe(true);
  });
});