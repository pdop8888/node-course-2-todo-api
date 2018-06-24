//const MongoClient = require('mongodb').MongoClient;
// object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
   if (err) {
       return console.log('Unable to connect to MongoDB server.');
   }
   console.log('Connected to MongoDB server');
   const db = client.db('TodoApp');
   // TodoApp has Todos,Users

   // deleteMany
   db.collection('Users').deleteMany({text: 'Eat lunch'}).then((result) => {
   console.log(result);
   });
   // deleteOne
   // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
   // console.log(result); 
   // });
   //  
   // findOneAndDelete
   db.collection('Users').findOneAndDelete({
       _id: new ObjectID("5afc54cc7d1d0824f0f6a9a1")
    }).then((results) => {
   console.log(JSON.stringify(results, undefined, 2)); 
   }); 
   //client.close();
});