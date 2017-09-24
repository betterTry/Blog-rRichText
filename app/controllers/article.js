'use strict'

var Article = require('../models/article');
var Work = require('../models/work');

var Promise = require('bluebird');
var xss = require('xss');

exports.get = function *(next) {
	yield this.render('include/write', {
		title: '写作'
	});
}

exports.init = function *(next) {
	var user = this.state.user;
	var data = yield Work.find({_id: {$in: user.works}})
							.populate('articles', '-meta -content')
							.exec();
	var article;
	if (data.length) {
		var id = data[0].articles[0]._id
		article = yield Article.findOne({_id: id}, 'content publish')
	}


	this.response.body = {
		success: 1,
		data: data,
		article: article || {}
	}
}

exports.save = function *(next) {
	var body = this.request.fields;
	var html = body.content,
		articleId = body.article,
		title = body.title;

	var article = yield Article.findOne({_id: articleId}).exec();
	article.name = title;
	article.content = html;
	try {
		yield article.save();
		var success = 1;
	} catch(err) {
		var success = 0;
	}

	this.response.body = {
		success: success
	}

}

exports.removeArticle = function *(next) {
	var user = this.state.user;
	var id = this.params.id,
			workId = this.request.query.workId;
	try {
		var article = yield Article.remove({_id: id}).exec();
		var work = yield Work.findOne({_id: workId});
		work.articles.splice(work.articles.indexOf(id), 1);
		yield work.save();
		if (article.publish) {
			user.articles.splice(user.articles.indexOf(id), 1);
			yield user.save();
		}

		var success = 1;
	} catch(err) {
		var success = 0;
	}
	this.response.body = {
		success: success
	}
}

exports.publish = function *(next) {
	var user = this.state.user;
	var body = this.request.fields;
	var html = body.content,
		articleId = body.article,
		title = body.title,
		img = body.img,
		text = body.text;

	// xss处理;
	var options = {
		whiteList: {
			a: ['href', 'title', 'target'],
			img: ['width', 'height', 'alt', 'src'],
			h1: '', h2: '', h3: '', h4:'',
			p: '',
			b: '', strike: '', i: '',
			blockquote: '',
			pre: '', code:'',
			br: '', hr: ''
		},
		stripIgnoreTagBody: true,
		stripIgnoreTag: true
	}
	var myxss = new xss.FilterXSS(options);
	html = myxss.process(html);

	if(img.indexOf('http://localhost:3000') == 0) {
		img = img.replace(/normal/,'thumbnail');
	}

	var response = {};
	try {
		var article = yield Article.findOne({_id: articleId}).exec();
		article.name = title;
		article.content = html;
		article.publish = true;
		article.thumbnail = img;
		article.text = text;
		yield article.save();
		user.articles.push(articleId);
		yield user.save();
		response = {
			success: 1,
			id: articleId
		}
	} catch(err) {
		response.success = 0;
		console.log(err);
	}
	this.response.body = response;

}

exports.cpublish = function *(next) {
	var id = this.request.query.id;
	try {
		var article = yield Article.findOne({_id: id}).exec();
		article.publish = false;
		yield article.save();
		var success = 1;
	} catch(err) {
		var success = 0;
		console.log(err);
	}
	this.response.body = {
		success: success
	}

}

exports.find = function *(next) {
	var id = this.params.id;
	try{
		var article = yield Article.findOne({_id: id}, {content: 1}).exec();
		var success = 1;
	} catch(err) {
		var success = 0;
		console.log(err)
	}
	this.response.body = {
		success: success,
		data: article
	}

}

exports.newWork = function *(next) {
	var user = this.state.user;
	var name = this.request.query.name;
	try {
		var work = new Work({name: name});
		yield work.save();
		user.works.push(work._id);
		yield user.save();
		var success = 1;
	} catch(err) {
		var success = 0, work = '';
	}
	this.response.body = {
		success: success,
		id: work ? work._id : ''
	}
}

exports.removeWork = function *(next) {
	var user = this.state.user;
	var workId = this.request.query.workId;
	try {
		yield Work.remove({_id: workId}).exec();
		yield Article.remove({work: workId}).exec();
		user.works.splice(user.works.indexOf(workId), 1);
		yield user.save();
		var success = 1;
	} catch(err) {
		var success = 0
	}
	this.response.body = {
		success: success
	}
}
exports.newArticle = function *(next) {
	var id = this.params.id;
	try {

		var article = new Article({work: id});
		yield article.save();
		var work = yield Work.findOne({_id: id}).exec();
		work.articles.unshift(article._id);
		yield work.save();
		var success = 1;
		var id = article._id;
	} catch(err) {
		var success = 0;
		var id = 0;
		console.log(err);
	}

	this.response.body = {
		success: success,
		id: id
	}
}

exports.rework = function *(next) {
	var fields = this.request.fields;
	var id = fields.id;
	var name = fields.name;
	try{
		yield Work.update({_id: id}, {$set:{name: name}}).exec();
		var success = 1;
	} catch(err) {
		console.log(err);
		var success = 0;
	}
	this.response.body = {
		success: success
	}

}
