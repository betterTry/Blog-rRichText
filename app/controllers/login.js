'use strict'

exports.login = function *(next) {

	yield this.render('include/login', {
		title: '登录|注册'
	})
}
