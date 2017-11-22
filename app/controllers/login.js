'use strict'

exports.login = function *(next) {
  const signUp = this.request.query.signUp;
	yield this.render('include/login', {
		title: '登录|注册',
    state: {
      signUp: signUp
    }
	})
}
