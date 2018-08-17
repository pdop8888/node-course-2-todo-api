const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should NOT create a new todo with invalid body data', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)

        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done); 
    });
});

describe('GET /todos/:id', () => {
    it('should todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done); 
    });

    it('should return 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non object id', (done) => {
        request(app)
        .get(`/todos/123abc`)
        .expect(404)
        .end(done); 
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
        }
        Todo.findById(hexId).then((todo) => {
            expect(todo).toBeFalsy();
            done();
        }).catch((e)=>done(e));
    }); 
    });

    it('should return 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non object id', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .expect(404)
        .end(done); 
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        // grab id of first item
        // update the text to something
        // set completed to true
        // expect 200 and response text change and completed is true
        // and completedAt is a number (use toBeA)
        const hexId0 = todos[0]._id.toHexString();
        const text = 'East some caca 0';
        request(app)
        .patch(`/todos/${hexId0}`)
        .send({completed: true, text})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId0);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            // expect(typeof number).toBe('number').
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second item
        // update text, set completed to false
        // 200
        // expect text is changed, completed false, completedAt is null
        // which is toBeFalsy
        const hexId1 = todos[1]._id.toHexString();
        const text = 'East some more caca 1';
        request(app)
        .patch(`/todos/${hexId1}`)
        .send({completed : false, text})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId1);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
        })
        .end(done); 
    });
});