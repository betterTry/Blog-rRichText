(function() {
	var signIn = document.querySelector('.signIn');
	var signUp = document.querySelector('.signUp');
	var signInBox = document.querySelector('.signInBox');
	var signUpBox = document.querySelector('.signUpBox');
	signIn.onclick = function() {
		signIn.className += ' current';
		signUp.className = 'signUp';
		signInBox.style.display = 'block';
		signUpBox.style.display = 'none';
	}
	signUp.onclick = function() {
		signUp.className += ' current';
		signIn.className = 'signIn';
		signUpBox.style.display = 'block';
		signInBox.style.display = 'none';
	}
})();
// 登录
(function () {
	const signInBox = document.querySelector('.signInBox');
	const input = signInBox.querySelectorAll('.formInput');
	const status = signInBox.querySelectorAll('.status');
	const state = [];
	// 输入框
	input.forEach(function(elm, index) {
		state.push({
			show: false,
			error: false,
			text: (index === 0 ? '用户名' : '密码')
		});
		checkInput(elm, index, true);
		status[index].addEventListener('click', function() {
			elm.value = '';
			this.style.display = 'none';
			state[index].show = false;
		});
	});

	var loginButton = signInBox.querySelector('.loginButton');
	loginButton.onclick = handleEnter;
	window.addEventListener('keydown', function(e) {
		if (e.keyCode === 13) {
			handleEnter();
		}
	})
	function handleEnter() {
		var data = [];
		for(var i = 0, length = input.length; i < length; i++) {
			var value = checkInput(input[i], i);
			data.push(value);
			if (!value) return value;
		}
		reqwest({
			url: '/user/signIn',
			method: 'post',
			data: {
				name: data[0],
				password: data[1]
			},
			success: function({code}) {
				if (code === 0) location.pathname = '/';
			}
		})
	}
	function checkInput(elm, index, listen) {
		var parent = elm.parentNode;
		var _status = status[index];
		var _state = state[index];
		var errorInfo = parent.querySelector('.errorInfo');
		if (listen) {
			elm.addEventListener('input', handleInput.bind(elm, event, index, false));
			elm.addEventListener('focus', function (e) {
				e.stopPropagation();
				if (_state.error) {
					parent.className = parent.className.replace(' bgRed', '');
					errorInfo.style.display = 'none';
					_state.error = false;
				}
				if (_state.show) {
					_status.style.display = 'none';
					_state.show = false;
				}
				parent.className += ' bottomColor';
			});
			elm.addEventListener('blur', function (e) {
				parent.className = parent.className.replace(' bottomColor', '');
			});
		} else {
			var value = handleInput(elm, index, true);
			if (_state.error) return false;
			return value;
		}

		function handleInput(elm, index, click) {
			var value = (this || elm).value;
			var length = value.length;
			var _state = state[index];
			var _status = status[index];
			var error = _state.error;
			var show = _state.show;
			var text = _state.text;
			if ((length <6 && click || length > 20) && !error) {
				parent.className += ' bgRed';
				_status.className += ' wrong';
				errorInfo.textContent = `${text}在6-20字符之内`;
				errorInfo.style.display = 'inline';
				_state.error = true;
			} else if (length <= 20 && length >= 6 && error) {
				parent.className = parent.className.replace(' bgRed', '');
				_status.className = _status.className.replace(' wrong', '');
				errorInfo.style.display = 'none';
				_state.error = false;
			}
			if (!show && value) {
				_status.style.display = 'inline-block';
				_state.show = true;
			} else if (show && !value) {
				_status.style.display = 'none';
				errorInfo.style.display = 'none';
				_state.show = false;
			} else if (!show && !value) {
				_status.style.display = 'inline-block';
				_state.show = true;
				parent.className += ' bgRed';
				errorInfo.textContent = `${text}在6-20字符之内`;
				errorInfo.style.display = 'inline';
				_state.error = true;
			}
			return value;
		}
	}
})();

// 注册
(function() {
	var signUpBox = document.querySelector('.signUpBox');
	var input = signUpBox.querySelectorAll('.formInput');
	var status = signUpBox.querySelectorAll('.status');
	var state = [];
	// 输入框
	input.forEach(function(elm, index) {
		state.push({
			show: false,
			error: false,
			text: (index === 0 ? '用户名' : '密码')
		});
		checkInput(elm, index, true);
		status[index].addEventListener('click', function() {
			elm.value = '';
			this.style.display = 'none';
			state[index].show = false;
		});
	});

	var loginButton = signUpBox.querySelector('.loginButton');
	loginButton.onclick = handleEnter;
	window.addEventListener('keydown', function(e) {
		if (e.keyCode === 13) {
			loginButton.click();
		}
	})
	function handleEnter() {
		var data = [];
		for(var i = 0, length = input.length; i < length; i++) {
			var value = checkInput(input[i], i);
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
			success: function(response) {
				if (response.code === 0) location.path = '/';
			}
		})
	}
	function checkInput(elm, index, listen) {
		var parent = elm.parentNode;
		var errorInfo = parent.querySelector('.errorInfo');
		var _state = state[index];
		var _status = status[index];
		if (listen) {
			elm.addEventListener('input', handleInput.bind(elm, event, index, false));
			elm.addEventListener('focus', function (e) {
				e.stopPropagation();
				if (_state.error) {
					parent.className = parent.className.replace(' bgRed', '');
					errorInfo.style.display = 'none';
					_state.error = false;
				}
				if (_state.show) {
					_status.style.display = 'none';
					_state.show = false;
				}
				parent.className += ' bottomColor';
			});
			elm.addEventListener('blur', function (e) {
				parent.className = parent.className.replace(' bottomColor', '');
			});
		} else {
			var value = handleInput(elm, index, true);
			if (_state.error) return false;
			return value;
		}

		function handleInput(elm, index, click) {
			var value = (this || elm).value;
			var length = value.length;
			var _state = state[index];
			var _status = status[index];
			var error = _state.error;
			var show = _state.show;
			var text = _state.text;

			if ((click && length < 6 || length > 20) && !error) {
				parent.className += ' bgRed';
				_status.className += ' wrong';
				errorInfo.textContent = `${text}在6-20字符之内`;
				errorInfo.style.display = 'inline';
				_state.error = true;
			} else if (length <= 20 && length >= 6 && error) {
				parent.className = parent.className.replace(' bgRed', '');
				_status.className = _status.className.replace(' wrong', '');
				errorInfo.style.display = 'none';
				_state.error = false;
			} else if (click && index === 2 && value !== input[1].value) {
				parent.className += ' bgRed';
				_status.className += ' wrong';
				errorInfo.textContent = '两次输入密码不一致';
				errorInfo.style.display = 'inline';
				_state.error = true;
			}
			if (!show && value) {
				_status.style.display = 'inline-block';
				_state.show = true;
			} else if (show && !value) {
				_status.style.display = 'none';
				errorInfo.style.display = 'none';
				_state.show = false;
			} else if (!show && !value) {
				_status.style.display = 'inline-block';
				_state.show = true;
				parent.className += ' bgRed';
				errorInfo.textContent = `${text}在6-20字符之内`;
				errorInfo.style.display = 'inline';
				_state.error = true;
			}
			return value;
		}
	}
})();
