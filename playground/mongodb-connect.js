//const MongoClient = require('mongodb').MongoClient;
// object destructuring
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'emmy', age:25};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
   if (err) {
       return console.log('Unable to connect to MongoDB server.');
   }
   console.log('Connected to MongoDB server');
   const db = client.db('TodoApp');

//    db.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
//    }, (err, result) => {
//     if (err) {
//         return console.log('Unable to insert todo', err);
//     }

//     console.log(JSON.stringify(result.ops, undefined, 2));
//    });

db.collection('Users').insertOne({
    name: 'Bill',
    age: 40,
    location: '90503'
   }, (err, result) => {
    if (err) {
        return console.log('Unable to insert user', err);
    }

    //console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
    //console.log(result.ops);
   });

   client.close();
});