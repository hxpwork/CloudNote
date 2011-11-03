var mongoose = require('mongoose')
  , Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/note');

var UserAccount = new Schema({
   name        : {type : String, required : true, index : true}
  ,email       : {type : String, required : true}
  ,password    : {type : String, required : true}
});

var model_name = 'UserAccount';
var  coll_name = 'accounts';
mongoose.model(model_name, UserAccount, coll_name);

