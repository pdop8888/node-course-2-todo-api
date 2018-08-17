var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri,{ useNewUrlParser: true });

module.exports = {mongoose};