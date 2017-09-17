'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	var signIn = document.querySelector('.signIn');
	var signUp = document.querySelector('.signUp');
	var signInBox = document.querySelector('.signInBox');
	var signUpBox = document.querySelector('.signUpBox');
	signIn.onclick = function () {
		signIn.className += ' current';
		signUp.className = 'signUp';
		signInBox.style.display = 'block';
		signUpBox.style.display = 'none';
	};
	signUp.onclick = function () {
		signUp.className += ' current';
		signIn.className = 'signIn';
		signUpBox.style.display = 'block';
		signInBox.style.display = 'none';
	};
})();
// 登录
(function () {
	var signInBox = document.querySelector('.signInBox');
	var input = signInBox.querySelectorAll('.formInput');
	var state = [];
	// 输入框
	input.forEach(function (elm, index) {
		state.push({
			show: false,
			error: false,
			text: index === 0 ? '用户名' : '密码'
		});
		checkInput(elm, index, true);
	});

	var loginButton = signInBox.querySelector('.loginButton');
	loginButton.onclick = handleEnter;
	window.addEventListener('keydown', function (e) {
		if (e.keyCode === 13) {
			handleEnter();
		}
	});
	function handleEnter() {
		var data = [];
		if ((typeof status === 'undefined' ? 'undefined' : _typeof(status)) === 'object') status = null;
		for (var i = 0, length = input.length; i < length; i++) {
			var value = checkInput(input[i], i);
			data.push(value);
			if (!value) return value;
		}
		reqwest({
			url: '/user/signUp',
			method: 'post',
			data: {
				name: data[0],
				password: data[1]
			},
			success: function success(_ref) {
				var code = _ref.code;

				if (code === 0) location.pathname = '/';
			}
		});
	}
	function checkInput(elm, index, listen) {
		var parent = elm.parentNode;
		var status = parent.querySelector('.status');
		var errorInfo = parent.querySelector('.errorInfo');
		if (listen) {
			elm.addEventListener('input', handleInput.bind(elm, event, index));
			elm.addEventListener('focus', function (e) {
				e.stopPropagation();
				var className = parent.className;
				if (state[index].error) {
					parent.className = className.replace(' bgRed', '');
					errorInfo.style.display = 'none';
					state[index].error = false;
				}
				if (state[index].show) {
					status.style.display = 'none';
					state[index].show = false;
				}
				parent.className += ' bottomColor';
			});
			elm.addEventListener('blur', function (e) {
				parent.className = parent.className.replace(' bottomColor', '');
			});
		} else {
			var value = handleInput(elm, index);
			if (state[index].error) return false;
			return value;
		}

		function handleInput(elm, index) {
			var value = (this || elm).value;
			var length = value.length;
			var error = state[index].error;
			var show = state[index].show;
			var text = state[index].text;
			if (length > 20 && !error) {
				parent.className += ' bgRed';
				status.className += ' wrong';
				errorInfo.textContent = text + '\u57286-20\u5B57\u7B26\u4E4B\u5185';
				errorInfo.style.display = 'inline';
				state[index].error = true;
			} else if (length <= 20 && error) {
				parent.className = parent.className.replace(' bgRed', '');
				status.className = status.className.replace(' wrong', '');
				errorInfo.style.display = 'none';
				state[index].error = false;
			}
			if (!show && value) {
				status.style.display = 'inline-block';
				state[index].show = true;
			} else if (show && !value) {
				status.style.display = 'none';
				errorInfo.style.display = 'none';
				state[index].show = false;
			} else if (!show && !value) {
				status.style.display = 'inline-block';
				state[index].show = true;
				parent.className += ' bgRed';
				errorInfo.textContent = text + '\u57286-20\u5B57\u7B26\u4E4B\u5185';
				errorInfo.style.display = 'inline';
				state[index].error = true;
			}
			return value;
		}
	}
})();

// 注册
(function () {
	var signUpBox = document.querySelector('.signUpBox');
	var input = signUpBox.querySelectorAll('.formInput');
	// 输入框
	input.forEach(function (elm) {
		checkInput(elm, true);
	});

	var loginButton = signUpBox.querySelector('.loginButton');
	loginButton.onclick = handleEnter;
	window.addEventListener('keydown', function (e) {
		if (e.keyCode === 13) {
			loginButton.click();
		}
	});
	function handleEnter() {
		var data = [];
		for (var i = 0, length = input.length; i < length; i++) {
			var value = checkInput(input[i]);
			data.push(value);
			if (!value) return value;
		}
		reqwest({
			url: '/user/add',
			method: 'post',
			data: {
				name: data[0],
				password: data[1]
			},
			success: function success(response) {
				if (response.code === 0) location.path = '/';
			}
		});
	}
	function handleInputNoStatus() {}
	function checkInput(elm, listen) {
		var show = false;
		var more = false;
		var parent = elm.parentNode;
		var status = parent.querySelector('.status');
		if (listen) {
			elm.addEventListener('input', handleInput);
			elm.addEventListener('focus', function (e) {
				e.stopPropagation();
				var className = parent.className;
				if (className.indexOf('bgRed') > -1) {
					parent.className = className.replace(' bgRed', '');
					more = false;
				}
				if (status.style.display === 'block') {
					status.style.display = 'none';
					show = false;
				}
				parent.className += ' bottomColor';
			});
			elm.addEventListener('blur', function (e) {
				parent.className = parent.className.replace(' bottomColor', '');
			});
		} else {
			var value = handleInput(elm);
			if (more) return false;
			return value;
		}

		function handleInput(elm) {
			var value = (this || elm).value;
			var length = value.length;
			if (length > 20 && !more) {
				parent.className += ' bgRed';
				status.className += ' wrong';
				more = true;
			} else if (length <= 20 && more) {
				parent.className = parent.className.replace(' bgRed', '');
				status.className = status.className.replace(' wrong', '');
				more = false;
			}
			if (!show && value) {
				status.style.display = 'inline-block';
				show = true;
			} else if (show && !value) {
				status.style.display = 'none';
				show = false;
			} else if (!show && !value) {
				status.style.display = 'inline-block';
				show = true;
				parent.className += ' bgRed';
				more = true;
			}
			return value;
		}
	}
})();