'use strict'

var fs = require('co-fs');
var path = require('path');
var util = require('../util/util.js');

exports.pic = function *(next) {
	var data = this.request.fields;
	var pic = data.pic[0];
	var _path = pic.path;
	var type = pic.type;

	if(type.indexOf('image') > -1){ // 是图片;

		var name = Date.now() + '.' + type.split('/')[1];
		var newPath = path.join(__dirname, '../../', 'public/image/normal', name);
		var smallPath = path.join(__dirname, '../../', 'public/image/thumbnail', name);

		try{
			var readData = yield fs.readFile(_path);
			fs.writeFile(newPath, readData); // 存储正常图片;
			yield util.resize(_path, smallPath); // 缩略图;
			var success = 1,
				img = '/image/normal/' + name;
		} catch(err) {
			var success = 0,
				img = '';
			console.log(err);
		}
		this.response.body = {
			success: success,
			img: img
		}
	}
	
	
}


