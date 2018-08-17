require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

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
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;
    // validate the id or 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // remove by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    // validate the id or 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // patch
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // new is an option
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, ()  => {
    console.log('Started on port ${port}');
});

module.exports = {app};
