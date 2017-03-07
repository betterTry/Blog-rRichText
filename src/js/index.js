(function() {
	var movediv = document.querySelector('.movediv');
	var moon = document.querySelector('.moon');
	var flight = document.querySelector('.flight');
	var flyStar = document.querySelector('.flyStar');
	var land = document.querySelector('.land');
	var rocket = document.querySelector('.rocket');
	var starBox = document.querySelector('.starBox');



	movediv.onmousemove = function(e) {
		var _getPos = getPos(),
			pagePos = _getPos.pagePos(e),
			offset = _getPos.offset(e.currentTarget);
		var posX = pagePos.x - offset.x,
			posY = pagePos.y - offset.y;
		move(moon, posX, posY, 10, 10);
		move(flight, posX, posY, 20, 0);
		move(flyStar, posX, posY, 20, 5);
		move(land, posX, posY, 3, 3, true);
		move(rocket, posX, posY, 0, 20);
		move(starBox, posX, posY, 3, 3);
	}

	function getPos() {
		var pagePos = function(e) {
			var e = e || window.event;
			var pageX, pageY;
			if(e.pageX) {
				pageX = e.pageX;
				pageY = e.pageY;
			} else {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
					scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
				var clientX = e.clientX,
					clientY = e.clientY;
				pageX = scrollLeft + clientX;
				pageY = scrollTop + clientY;
			}
			return {
				x: pageX,
				y: pageY
			}
		};
		var offset = function(elm) {
			var offsetX = 0, offsetY = 0;
			do {
				offsetX += elm.offsetLeft;
				offsetY += elm.offsetTop;
			} while ((elm = elm.offsetParent) && (elm.tagName !== 'BODY'))
			return {
				x: offsetX,
				y: offsetY
			}
		};
		return {
			pagePos: pagePos,
			offset: offset
		}
	}


	function move(elm, posX, posY, left, top, down) {
		var w = movediv.scrollWidth / 2,
			h = movediv.scrollHeight / 2;
		var i = 1;
		if(down) {
			i = -1;
		}
		var x = i * (left * posX / w - left),
			y = i * (top * posY / h - top);
		elm.style.cssText = 'transform:translateX(' + x + 'px) translateY(' + y + 'px)';
	}
})();

// .container.movediv(style="margin-top:70px")
// 		img.moon(src="pic/moveDiv/moon_150x150.png")
// 		img.flight(src="pic/moveDiv/flight_200x140.png",width=35,height=25)
// 		img.flyStar(src="pic/moveDiv/flyStar_150x100.png")
// 		img.land(src="pic/moveDiv/land.png")
// 		img.rocket(src="pic/moveDiv/rocket_70x160.png",width=28,height=64)
// 		div.starBox
// 			- var path = "pic/moveDiv/star1_30x30.png"
// 			img.star1(src=path,width=10,height=10,style="left:100px;top:10px")
// 			img.star1(src=path,width=10,height=10,style="top:15px;right:20px")
// 			img.star1(src=path,width=15,height=15,style="top:5px;right:10px")
// 			img.star1(src=path,width=15,height=15,style="top:20px;left:-4px")
// 			img.star1(src=path,width=8,height=8,style="top:175px;left:20px")
// 			img.star1(src=path,width=8,height=8,style="top:10px;left:5px;")