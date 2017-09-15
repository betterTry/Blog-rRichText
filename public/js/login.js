'use strict';

(function () {
	var input = document.querySelectorAll('.formInput');
	input.forEach(function (elm) {
		var show = false;
		var more = false;
		var parent = elm.parentNode;
		var status = parent.querySelector('.status');
		elm.addEventListener('input', function (e) {
			var value = this.value;
			var length = value.length;
			if (!show && value) {
				status.style.display = 'inline-block';
				show = true;
			} else if (show && !value) {
				status.style.display = 'none';
				show = false;
			}
			if (length > 20 && !more) {
				parent.className += ' bgRed';
				status.className += ' wrong';
				more = true;
			} else if (length <= 20 && more) {
				parent.className = parent.className.replace(' bgRed', '');
				status.className = status.className.replace(' wrong', '');
				more = false;
			}
		});
		elm.addEventListener('focus', function (e) {
			parent.className += ' bottomColor';
		});
		elm.addEventListener('blur', function (e) {
			parent.className = parent.className.replace(' bottomColor', '');
		});
	});
})();