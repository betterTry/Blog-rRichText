'use strict';

var emit;
var setCanvas = function () {
	return function () {
		var canvas = document.getElementById('bg-canvas');
		var context = canvas.getContext('2d');
		var width = canvas.scrollWidth,
		    height = canvas.scrollHeight;
		var scaleW = 1366 / width,
		    scaleH = 1075 / height;

		context.fillStyle = '#090723';
		context.fillRect(0, 0, width * scaleW, scaleH * height);

		// 星星的角度;
		var angle = 0.904;
		// Math.asin(1075/1366);

		var x = [],
		    y = [],
		    radius = [];
		for (var i = 0; i < 150; i++) {
			x[i] = random(0, 1366, false);
			y[i] = random(0, 1075, false);
			radius[i] = random(0.2, 0.8);
			drawCircle(x[i], y[i], radius[i], '#fff');
		}

		var star1 = [],
		    h1,
		    w1,
		    v1;
		var star2 = [],
		    h2,
		    w2,
		    v2;
		var ed1 = ed2 = 0;
		setStar1();
		setStar2();

		var pos1 = pos(0.01),
		    pos2 = pos(0.02),
		    pos3 = pos(0.04); // 星星速度函数;

		emit = setInterval(function () {
			// 每一帧;
			context.clearRect(0, 0, width * scaleW, scaleH * height);
			context.fillStyle = '#090723';
			context.fillRect(0, 0, width * scaleW, scaleH * height);

			starMove(0, 30, pos1());
			starMove(30, 60, pos2());
			starMove(60, 90, pos3());
			starMove(90, 150);

			if (ed1 == 0) {
				drawFlame(1);
			}
			if (ed2 == 0) drawFlame(2);

			if (ed1 > 0) ed1 -= 50;
			if (ed2 > 0) ed2 -= 50;

			if (star1[0] <= 0) {
				setStar1(); //重置star;
				ed1 = random(0, 8, true) * 1000;
			}
			if (star2[1] >= 1075) {
				setStar2();
				ed2 = random(0, 8, true) * 1000;
			}
		}, 10);

		function setStar1() {
			star1 = [random(400, 1366, true), 0];
			h1 = random(30, 100);
			w1 = random(0, 0.4);
			v1 = random(6, 10, true);
		}
		function setStar2() {
			star2 = [1366, random(0, 500, true)];
			h2 = random(30, 100);
			w2 = random(0, 0.4);
			v2 = random(6, 10, true);
		}
		function drawFlame(value) {
			context.save();
			if (value == 1) {
				context.translate(star1[0], star1[1]);
			} else {
				context.translate(star2[0], star2[1]);
			}
			context.rotate(0.904);
			context.beginPath();
			context.moveTo(0, 0);
			if (value == 1) {
				context.lineTo(0, h1);
				context.lineWidth = w1;
			} else {
				context.lineTo(0, h2);
				context.lineWidth = w2;
			}
			context.strokeStyle = '#fff';
			context.closePath();
			context.stroke();
			context.restore();
			if (value == 1) {
				star1[0] -= v1;
				star1[1] += v1 * 1075 / 1366;
			} else {
				star2[0] -= v2;
				star2[1] += v2 * 1075 / 1366;
			}
		}

		// @ params n: 星星速度;
		function pos(n) {
			var x = 0;
			return function () {
				return x -= n;
			};
		}

		function starMove(begin, end, s) {
			context.save();
			if (s) context.translate(s, 0);
			for (var i = begin; i < end; i++) {
				if (Math.abs(s) > x[i]) x[i] = 1366 + Math.abs(s);

				drawCircle(x[i], y[i], radius[i], '#fff');
			}
			context.restore();
		}

		function drawCircle(x, y, radius, color) {
			context.beginPath();
			context.fillStyle = color;
			context.arc(x, y, radius, 0, Math.PI * 2, true);
			context.closePath();
			context.fill();
		}

		function random(x, y, type) {
			if (type) {
				return Math.floor(Math.random() * (y - x + 1)) + x;
			}
			return Math.random() * (y - x) + x;
		}
	};
}();