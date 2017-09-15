(function() {
	const input = document.querySelectorAll('.formInput');
	input.forEach((elm) => {
		let show = false;
		let more = false;
		const parent = elm.parentNode;
		const status = parent.querySelector('.status');
		elm.addEventListener('input', function (e) {
			const value = this.value;
			const length = value.length;
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
			} else if (length <= 20 && more){
				parent.className = parent.className.replace(' bgRed', '');
				status.className = status.className.replace(' wrong', '');
				more = false;
			}
		})
		elm.addEventListener('focus', function (e) {
			parent.className += ' bottomColor';
		})
		elm.addEventListener('blur', function (e) {
			parent.className = parent.className.replace(' bottomColor', '');
		})
	});

})();
