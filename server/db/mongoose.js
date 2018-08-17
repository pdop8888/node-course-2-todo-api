var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(uri,{ useNewUrlParser: true });

module.exports = {mongoose};