'use strict'

var User = require('../models/user');
var Promise = require('bluebird');
var exp = require('../constant/exp');

exports.hasLogin = function  *(next) {
	var user = this.session.user;
	if(!user){
		this.redirect('/login')
	}
	else{
		yield next
	}
}

exports.signIn = function *(next) {
  var params = this.request.fields;
  var name = params.name;
  var password = params.password;
  var user = yield User.findOne({name: name}).exec();
  var code = 0;
  if (!user) code = 1001;
  else {
    var isMatch = yield user.comparePassword(password);
    if (!isMatch) code = 1002;
  }
  this.session.user = user ? user.id : null;
  this.response.body = {
    code: code
  }
}

exports.logOut = function *(next) {
  delete this.session.user;
  this.response.body = {
    code: 0
  }
}

exports.addUser = function *(next) {
  var params = this.request.fields;
  var name = params.name;
  var password = params.password;
  var code = 0;

  if (!/^[\w\u4e00-\u9fa5]{6,16}$/.test(name)) code = 1001;
  else if (!/^[\w\\\[\]/.+)(}{*&-^%$#@!~><,|]{6,16}$/.test(password))code = 1002;
  else {
    try {
      var user = new User({
        name: name,
        password: password
      });
      yield user.save();
      this.session.user = user._id;
    } catch(err) {
      code = 1003;
    }
  }

  this.response.body = {
    code: code
  };
}

exports.removeUser = function *(next) {
  var params = this.request.fileds;
  var name = params.name;
  var code = 0;
  try {
    var user = yield User.remove({name: name}).exec();
  } catch(err) {
    code = 1002
  }
  this.response.body = {
    code: code
  }
}

exports.getLevel = function *(next) {
	var user = this.state.user;
	if (user) {
		var EXP = user.EXP;
		var arr = Object.keys(exp);
		for(var i = 0, length = arr.length, sum = 0; i < length; i++) {
			if(sum > EXP) break;
			sum += exp[i+1];
		}
		this.state.level = {
			level: i,
			score: EXP - sum + exp[i],
			exp: exp[i]
		}
	}
	yield next
}
