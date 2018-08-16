// mongodb-update

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5b2f2484ea4673ee312be39a')
    }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then((results) => {
            //console.log(JSON.stringify(results, undefined, 2));
            console.log(results);
        });
});