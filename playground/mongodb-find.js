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

   //var query = {completed: false};
   var query = {_id: new ObjectID('5afbb985dd07fd226857e8d2')};

//    db.collection('Todos').find(query).toArray().then((docs) => {
//        console.log('Todos');
//        console.log(JSON.stringify(docs, undefined, 2));
//    }, (err) => {
//         console.log('Unable to fetech todos', err);
//    });
db.collection('Todos').find(query).count().then((count) => {
    console.log(`Todos ${count}`);
}, (err) => {
     console.log('Unable to fetech todos', err);
});

var uquery = {name: 'Mike'};
db.collection('Users').find(uquery).toArray().then((docs) => {
    console.log((JSON.stringify(docs, undefined, 2)));
}, (err) => {
     console.log('Unable to fetech Users', err);
});

   //client.close();
});