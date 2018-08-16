// mongodb-update

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    var uquery = { name: 'Adolf' };
    var iquery = { _id: new ObjectID('5b75a4134a958e238487aa2d') };
    db.collection('Users').find(iquery).toArray().then((docs) => {
        console.log((JSON.stringify(docs, undefined, 2)));
    }, (err) => {
        console.log('Unable to fetech Users', err);
    });

    db.collection('Users').findOneAndUpdate(iquery, {
            $set: {
                name: 'Fred'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((results) => {
            //console.log(JSON.stringify(results, undefined, 2));
            console.log(results);
        });
});