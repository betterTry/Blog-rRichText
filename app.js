// JavaScript Document
'use strict'

var Koa = require('koa');

var mongoose = require('mongoose');
var fs = require('fs');

var dbUrl = 'mongodb://localhost/blog';

mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			var newPath = path + '/' + file;
			var stat = fs.statSync(newPath)
			if(stat.isFile()){
				if(/(.*)\.(js|coffee)/.test(file)){
					require(newPath)
				}
			}
			else if(stat.isDirectory()){
				walk(newPath)
			}
		})
}
walk(models_path)

var app = new Koa();
var Router = require('koa-router');
var router = new Router();
var bodyParser = require('koa-better-body');
// var bodyParser = require('koa-bodyparser');
var session = require('koa-session');

var views = require('koa-views');


app.use(require('koa-static')('public'));

app.use(function *(next) {
	var font = this.cookies.get('font'),
		night = this.cookies.get('night'),
		family = this.cookies.get('family');
	this.state.font = font ? font : 'jian'; // 默认是简体;
	this.state.night = night ? night : 'off'; // 默认夜晚模式关闭;
	this.state.family = family ? family : 'hei';

	yield next;
})

app.use(views(__dirname + '/app/views' , {
	extension : 'pug'
}))

app.keys = ['mxysl'];
app.use(session(app))
app.use(bodyParser({formLimit:'300kb'}))

var User = require('./app/models/user');
app.use(function *(next){
	var user = this.session.user;
	if(user){
		var _user = yield User.findOne({_id : user}).exec();
		if (_user) {
			this.session.user = _user._id;
			this.state.user = _user;
		} else {
			this.session.user = null;
		}
	}
	else{
		this.state.user = null
	}
	yield next;
})

var port = 3100 || process.env.PORT;

//引入router,并且执行;
require('./config/router')(router);
app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(port);

console.log('listening at PORT 3100...')
