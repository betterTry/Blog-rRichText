var gm = require('gm');
var Promise = require('bluebird');

exports.resize = function(src, dest) {
	return new Promise(function(resolve, reject) {
		gm(src)
		.noProfile()
		.size(function(err, size) {
			if(err) {
				reject(err);
			} else {
				var width = size.width,
					height = size.height;
				if(width / height > 1.25) {
					var rWeight = height * 1.25;
					var x = (width - rWeight) / 2;
					this.crop(rWeight, height, x, 0);

				} else {
					var rHeight = width / 1.25;
					var y = (height - rHeight) / 2;
					this.crop(width, rHeight, 0, y);
				}

				this.resize(200, 160);
				this.write(dest, function(err) {
					if(err) reject(err);
					else resolve();
				});
			}
		});
	})
}
