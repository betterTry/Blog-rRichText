(function(){
	var top = 0;
	window.onscroll = function(e) {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var header = document.querySelector('.header');

		// 隐藏显示header;
		if(scrollTop > top) {
			header.style.cssText = 'transform:translateY(-80px);opacity:0.3';
			var className = setModel.className;
			if(className.indexOf('show') > 0) {
				setModel.className = className.replace(/ show/, '');
				setModel.style.display = 'none';
			}
		} else {
			header.style.cssText = 'transform:translateY(0);opacity:1';
		}
		top = scrollTop;

		var moveToT = document.querySelector('.moveToT');
		// 火箭;
		if(scrollTop >= 450) {
			moveToT.style.display = 'inline-block';
		} else {
			moveToT.style.display = 'none'
		}
	}

	var setModel = document.querySelector('.setModel');
	var sets = document.querySelectorAll('.nightOn, .nightOff, .song, .hei, .jian, .fan');
	var moon = document.querySelector('.night>span');
	var nightOn = sets[0],
		nightOff = sets[1],
		song = sets[2],
		hei = sets[3],
		jian = sets[4],
		fan = sets[5];
	var util = function() {
		var body = document.body;
		var close = function(elm) {
			elm.className = elm.className.replace(/ show/, '');
			elm.style.display = 'none';
		};
		var Song = function(e) {
			var e = e || window.event;
			e.stopPropagation();
			if(this.className.indexOf('open') < 0) {
				this.className += ' open';
				hei.className = hei.className.replace(/ open/,'');
				body.className = body.className.replace(/\s*fhei/, '') + ' fsong';
				document.cookie = 'family=song';
			}
			util.close(setModel);
		};
		var Hei = function(e) {
			var e = e || window.event;
			e.stopPropagation();
			if(this.className.indexOf('open') < 0) {
				this.className += ' open';
				song.className = song.className.replace(/ open/,'');
				body.className = body.className.replace(/\s*fsong/, '') + ' fhei';
				document.cookie = 'family=hei';
			}
			util.close(setModel);
		};
		var Jian = function(e) {
			var e = e || window.event;
			e.stopPropagation();
			document.cookie = 'font=jian';
			location.reload();
		}
		var Fan = function(e) {
			var e = e || window.event;
			e.stopPropagation();
			document.cookie = 'font=fan';
			location.reload();
		}
		var NightOn = function(e) {
			var e = e || window.event;
			if(this.className.indexOf('open') < 0) {
				this.className += ' open';
				nightOff.className = nightOff.className.replace(' open', '');
				body.className += ' nightModel';
				moon.className += ' moonIcon';
				document.cookie = 'night=on';
				clearInterval(emit);
				setCanvas();
			}
			util.close(setModel);
		}
		var NightOff = function(e) {
			var e = e || window.event;
			if(this.className.indexOf('open') < 0) {
				this.className += ' open';
				nightOn.className = nightOn.className.replace(' open', '');
				body.className = body.className.replace(/\s*nightModel/, '');
				moon.className = moon.className.replace(/\s*moonIcon/,'');
				document.cookie = 'night=off';
			}
			util.close(setModel);
		}
		var night
		return {
			close: close,
			Song: Song,
			Hei: Hei,
			Jian: Jian,
			Fan: Fan,
			NightOn: NightOn,
			NightOff: NightOff
		}
	};
	var util = util();
	song.onclick = function(e) {
		util.Song.call(this, e);
	}
	hei.onclick = function(e) {
		util.Hei.call(this, e);
	}
	jian.onclick = function(e) {
		util.Jian.call(this, e);
	}
	fan.onclick = function(e) {
		util.Fan.call(this, e);
	}
	nightOn.onclick = function(e) {
		util.NightOn.call(this, e);
	}
	nightOff.onclick = function(e) {
		util.NightOff.call(this, e);
	}

})(setCanvas);

(function() {
	var set = document.getElementById('set');
	var setModel = set.querySelector('.setModel');
	var setShow = false;
	set.onclick = function(e) {
		if(setShow) {
			setModel.style.display = 'none';
			setShow = false;
		} else {
			setModel.style.display = 'block';
			e.stopPropagation();
			window.addEventListener('click', hideSetModel)
			setShow = true;
		}
		if (headShow) {
			userInfoBox.style.display = 'none';
			headShow = false;
		}
	}
	setModel.onclick = function(e) {e.stopPropagation()};
	function hideSetModel(e) {
		if (e.target.className !== 'setModel') {
			setModel.style.display = 'none';
			setShow = false;
			window.removeEventListener('click', hideSetModel);
		}
	}

	var head = document.querySelector('#head');
	if (head) {
		var userInfoBox = head.querySelector('.userInfoBox');
		var logOut = userInfoBox.querySelector('.logOut');
		var headShow = false;
		head.onclick = function(e) {
			if (headShow) {
				userInfoBox.style.display = 'none';
				headShow = false;
			} else {
				userInfoBox.style.display = 'block';
				headShow = true;
				e.stopPropagation();
				window.addEventListener('click', hide);
			}
			if (setShow) {
				setModel.style.display = 'none';
				setShow = false;
			}
		};
		userInfoBox.onclick = function(e) {e.stopPropagation();}
		logOut.onclick = function() {
			reqwest({
				url: '/user/logOut',
				success: function(response) {
					if (response.code === 0) location.pathname = '/';
				}
			});
		}
		function hide(e) {
			if (e.target.className !== 'userInfoBox') {
				userInfoBox.style.display = 'none';
				headShow = false;
				window.removeEventListener('click', hide);
			}
		}
	}
})();
