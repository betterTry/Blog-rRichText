var deepCopy = function(obj) {
	var str, newObj = obj.constructor === Array ? [] : {};
	if(typeof obj !== 'object'){
		return;
	} else if (window.JSON) {
		str = JSON.stringify(obj);
		newObj = JSON.parse(str);
	} else {
		for(var i in obj) {
			newObj[i] = typeof obj[i] === 'object' ? this.deepCopy(obj[i]) : obj[i];
		}
	}
	return newObj;
};

var position = function(elm1, elm2) {
	var elm2 = elm2 || document.body;
	var left = 0, top = 0;
	do {
		left += elm1.offsetLeft;
		top += elm1.offsetTop;
	} while((elm1 = elm1.offsetParent) && elm1 !== elm2)
	return {left: left, top: top}
};

var type = function(item) {
	var result = Object.prototype.toString.call(item).replace('[object ','').replace(']','');
	return result;
};

var util = {
	deepCopy: deepCopy,
	position: position,
	type: type
};
export default util;
//# sourceMappingURL=util.js.map
