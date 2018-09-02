const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not  authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});


describe('POST /users', () => {
    it ('should create a user', (done) => {
        const email = 'example@example.com';
        const password = '123mnb!';
        request (app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e));
        });
    });

    it ('should return validation errors if request invalid', (done) => {
        const email = 'and';
        const password = '123!';
        request (app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });

    it ('should not create a user if email in use', (done) => {
        const email = users[0].email;
        const password = 'Password123';
        request (app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });
});

describe('POST /users', () => {
    it ('should login user and return auth token', (done) => {
        const email = users[1].email;
        const password = users[1].password;
        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                //console.log(`token0 ${user.tokens[0]}`);
                expect(user.tokens[0]).toHaveProperty('access','auth');
                expect(user.tokens[0]).toHaveProperty('token',res.headers['x-auth']);
                done();
            }).catch((e) => done(e));
        });
    });

    it ('should reject invalid login', (done) => {
        const email = users[1].email;
        const password = users[1].password + '1'; // wrong!
        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });        
    });
});

describe('DELETE /users/me/token', () => {
    it ('should remove auth token on logout', (done) => {
        const xauthToken = users[0].tokens[0].token;
        request(app)
        .delete('/users/me/token')
        .set('x-auth', xauthToken)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });

});
