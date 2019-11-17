'use strict';

const userController = require('../../controllers/userController');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));
const fakeDB = require('../../models');

jest.mock('../../controllers/emailController', () => ({
  sendValidEmail: jest.fn()
}));

const fakeMailCont = require('../../controllers/emailController');

describe('createUser', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const fakeUserData = {
    username: 'Blaaa',
    password: 'Blaaa',
    firstname: 'Blaaa',
    lastname: 'Blaaa',
    public_key: 'Blaaa',
    email: 'Blaaa',
  };

  const ctx = {
    method: 'POST',
    request: {
      body: fakeUserData
    },
    jwt: {}
  };

  it('should call next() if method is not POST', async () => {
    const ctx = {
      method: 'GET',
    };
    const fakeNext = jest.fn();

    await userController.createUser(ctx, fakeNext);
    
    expect(fakeNext).toHaveBeenCalled();
  });

  it('should set status 400 if user exists', async () => {
    const fakeNext = jest.fn();
    const fakeUser = {
      name: 'Bob',
      favoriteIceCream: 'vanilla'
    };
    
    fakeDB.User.findOne.mockResolvedValueOnce(fakeUser);
    await userController.createUser(ctx, fakeNext);
    
    expect(ctx.status).toEqual(400);
  });

  it('should return an error message if user exists', async () => {
    const fakeNext = jest.fn();
    const fakeUser = {
      name: 'Bob',
      favoriteIceCream: 'vanilla'
    };
    
    fakeDB.User.findOne.mockResolvedValueOnce(fakeUser);
    await userController.createUser(ctx, fakeNext);
    
    expect(ctx.body.errors).toEqual(['Username already exists.']);
  });

  it('should create user', async () => {
    
    fakeDB.User.findOne.mockResolvedValueOnce(null);
    await userController.createUser(ctx);
    
    expect(fakeDB.User.create).toHaveBeenCalledWith({
      username: fakeUserData.username,
      password: expect.anything(),
      firstname: fakeUserData.firstname,
      lastname: fakeUserData.lastname,
      publickey: fakeUserData.public_key,
      email: fakeUserData.email
    });
  });

  it('should send email', async () => {
      
    await userController.createUser(ctx);
    // This is what we want the method under test to do

    expect(fakeMailCont.sendValidEmail).toHaveBeenCalledWith(
      ctx, fakeUserData
    );

  });

  it('the body of ctx to equal username and email', async () => {

    const emailBody = {username: fakeUserData.username, email: fakeUserData.email};

    await userController.createUser(ctx);
    await fakeMailCont.sendValidEmail(ctx, fakeUserData);

    expect(ctx.body).toMatchObject(emailBody);
  });

  it ('should assign the user of ctx', async () => {

    const ctxUser = {username: fakeUserData.username};

    await userController.createUser(ctx);
    await fakeMailCont.sendValidEmail(ctx, fakeUserData);

    expect(ctx.user).toMatchObject(ctxUser);
  });

  it ('should assign the jwt modified value to true', async () => {

    await userController.createUser(ctx);
    await fakeMailCont.sendValidEmail(ctx, fakeUserData);

    expect(ctx.jwt.modified).toBe(true);

  });

  it ('should return 201 status', async () => {

    await userController.createUser(ctx);
    await fakeMailCont.sendValidEmail(ctx, fakeUserData);

    expect(ctx.status).toEqual(201);
  });
  
});

// function flushPromises() {
//   return new Promise(resolve => setTimeout(resolve, 0));
// }