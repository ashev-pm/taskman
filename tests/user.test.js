const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setUpDatabase } = require('./db');

beforeEach(setUpDatabase); 

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Johnymanenko Testman",
        email: "totalyfree@example.com",
        password: "securePass11"
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Johnymanenko Testman",
            email: "totalyfree@example.com"
        },
        token: user.tokens[0].token
    }); 
    expect(user.password).not.toBe('securePass11');
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password  
    }).expect(200);

    const user = await User.findOne({ email: userOne.email });
    expect(user.tokens[1].token).not.toBeNull()    
});

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: "totalyfree@example.com",
        password: "securePass11" 
    }).expect(400);
});

test('Should get porfile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not get porfile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `ulala`)
        .send()
        .expect(401)
});

test('Should delete porfile for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete a profile for not authenicated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `ulala`)
        .send()
        .expect(401)
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Updated Joe"
        })
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toBe('Updated Joe')
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Tajikistan"
        })
        .expect(400)
});


