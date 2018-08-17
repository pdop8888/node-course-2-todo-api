var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var url = '/todos';

app.use(bodyParser.json());

app.post(url, (req, res) => {
    console.log(req.body);

    var todo = new Todo({
        text: req.body.text
    });

    // save to database
    todo.save().then((doc) => {
        res.send(doc); // send doc back
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(3000, ()  => {
    console.log('Started on port 3000');
});

module.exports = {app};

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('unable to save todo');
// });

// var otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc,undefined,2));
// }, (e) => {
//     console.log('unable to save otherTodo');
// });