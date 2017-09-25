'use strict'
var main = require('../app/controllers/main');
var article = require('../app/controllers/article');
var update = require('../app/controllers/update');
var login = require('../app/controllers/login');
var user = require('../app/controllers/user');
var center = require('../app/controllers/center');

module.exports = function(router){

	// 主页
	router.get('/', user.getLevel, main.index);
	router.get('/more', main.more);
	// 文章
	router.get('/article/:id', user.getLevel, main.article);
	// 搜索文章
	router.get('/search', user.getLevel, main.search);

	// login;
	router.get('/login', login.login);
	// center;
	router.get('/center', user.getLevel, center.index);


	// write;
	router.get('/write', user.hasLogin, article.get);

	// 保存和提交;
	router.post('/write/save', article.save);
	router.post('/write/publish', article.publish);
	router.get('/write/cpublish', article.cpublish);


	// 初始化数据;
	router.get('/write/init', article.init);

	router.get('/write/article/:id', article.find);


	// 新建文集;
	router.get('/write/create/work', article.newWork);
	// 删除文集;
	router.delete('/write/delete/work', article.removeWork);
	// 新建文章;
	router.get('/write/create/article/:id', article.newArticle);
	// 删除文章;
	router.delete('/write/delete/article/:id', article.removeArticle);
	// 修改文集;
	router.post('/write/rework', article.rework);

	// 添加用户
	router.post('/user/add', user.addUser);
	// 登录
	router.post('/user/signIn', user.signIn);
	// 登出
	router.get('/user/logOut', user.logOut);




	router.post('/update/pic',  update.pic);

	// 404;
	router.get('*', function *() {
		yield this.render('include/error',{
			title: '您要找的页面不存在'
		})
	})

}
