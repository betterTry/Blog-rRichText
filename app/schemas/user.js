'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  name : {
    unique : true,
    type :String
  },
  openid : String,
  password : String,
  // 0 : normal,
  // 1 : verified,
  // 2 : professional
  role : {
    type : Number,
    default : 0
  },
  collections : [{type: ObjectId , ref: ''}],
  sign : String,
  head : {
    type : String,
    default : '/img/head/小男孩.jpg'
  }
  meta : {
    createAt : {
      type : Date,
      default : Date.now()
    },
    updateAt : {
      type : Date,
      default : Date.now()
    }
  }
});

workSchema.pre('save' , function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	next();
})
