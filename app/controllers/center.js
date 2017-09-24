exports.index = function *(next) {
  yield this.render('include/center', {
		title: '中心',
    state: this.state
	});
}
