'use strict'

var Article = require('../models/article');
exports.index = function *(next) {
	var articles = yield Article.find({publish: true}, {publish: 0, content: 0}).sort({'meta.updateAt': -1});
	var length = articles.length;

	if(articles.length) {
		var articles = articles.slice(0 ,15);
		articles.forEach(function(item, index) {
			if(item.text) {
				item.text = item.text.slice(0, 90);
			}
		})
	}
  console.log(articles);

	yield this.render('include/index', {
		title: '首页',
		articles: articles,
		state: this.state,
		length: length
	})
}

exports.article = function *(next) {
	var id = this.params.id;
	try{
		var article = yield Article.findOne({_id: id});
		yield this.render('include/article', {
			title: article.name,
			article: article,
			state: this.state
		})
	} catch(err) {
		console.log(err);
		yield this.render('include/error',{
			title: '您要找的页面不存在'
		})
	}

}

exports.search = function *(next) {
	var keyword = this.request.query.kw;
	var page = this.request.query.page;
	if(!page) page = 1;
	if(keyword) {
		try {
			var result = yield Article.find({publish: true, name: new RegExp(keyword, 'i')}, {content: 0, publish: 0, work: 0}).exec();
			var articles = result.slice((page-1) * 10, (page-1) * 10 + 10);
			var length = Math.ceil(result.length / 10);
			var success = 1;
		} catch(err) {
			console.log(err);
			var success = 0;
		}
	}
	yield this.render('/include/search', {
		title: '搜索 - ' + keyword,
		articles: articles ? articles : '',
		page: page,
		length: length ? length : '',
		success: success,
		state: this.state
	})
}

exports.more = function *(next) {
	var page = this.result.query.page;
	if(!page) {
		return false;
	}
	try{
		var success = 1;
		var articles = yield Article.find({publish: true}, {publish: 0, content: 0}, {skip: 15*(page -1), limit:15});
	} catch(err) {
		var success = 0;
		console.log(err);
	}

	yield this.response.body = {
		articles: articles,
		success: success
	}
}
