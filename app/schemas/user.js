'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  openid: String,
  password: String,
  role: {
    type: Number,
    default: 0  // 0: normal, 1: verified, 2: professional
  },
  works: [{type: ObjectId, ref: 'Work'}],
  articles: [{type: ObjectId, ref: 'Article'}],
  collections: [{type: ObjectId , ref: ''}],
  EXP: {
    type: Number,
    default: 0
  },
  sign: String,
  head: {
    type: String,
    default: '/pic/head/headMonky.jpg'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

userSchema.pre('save' , function(next){
  var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err , salt){
		if(err) return next(err)
		bcrypt.hash(user.password , salt , function(err , hash){
			if(err) return next(err)
			user.password = hash;
			next()
		})
	})
})

userSchema.methods = {
	comparePassword: function(_password){
		var password = this.password;
		return function(cb){
			bcrypt.compare(_password , password , function(err , isMatch){
				cb(err , isMatch)
			})
		}
	}
}

module.exports = userSchema;
