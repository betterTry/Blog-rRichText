'use strict';

(function () {
	var changeLeft = document.querySelector('.changeLeft'),
	    changeRight = document.querySelector('.changeRight');

	var item = document.querySelectorAll('.bannerLi');
	var length = item.length;

	changeLeft.onclick = changeBanner.bind(null, 'left');
	changeRight.onclick = changeBanner.bind(null, 'right');

	var banner = document.querySelector('.banner');

	var t = setInterval(changeBanner.bind(null, 'left'), 10000);

	function changeBanner(type) {
		clearInterval(t);
		var currentBanner = document.querySelector('.currentBanner');
		if (type == 'left') {
			var previous = currentBanner.previousSibling;
			_banner = previous ? previous : item[length - 1];
		} else {
			var next = currentBanner.nextSibling;
			_banner = next ? next : item[0];
		}
		_banner.className += ' currentBanner';
		currentBanner.className = currentBanner.className.replace(' currentBanner', '');

		t = setInterval(changeBanner.bind(null, 'left'), 10000);
	}
})();