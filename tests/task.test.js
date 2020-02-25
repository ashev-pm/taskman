const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const { 
    userOne, 
    userOneId, 
    userTwo, 
    userTwoId, 
    setUpDatabase, 
    taskOne,
    taskThree 
} = require('./db');

beforeEach(setUpDatabase); 

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "To test from my test"
        })
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should GET tasks for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2);
});

test('Should not delete task of another user', async () => {
    const respose = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})