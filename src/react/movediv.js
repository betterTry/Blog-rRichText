// === React & ReactDOM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import util from '../js/util';

class ImagesComponent extends React.Component {
	render() {
		var props = this.props;
		var src = props.src;
		var size = props.size;
		var pos = props.pos;
		var node = [];
		var transform = props.styleObj || '';
		src.forEach(function(item, index){
			var s = size[index];
			var p = pos[index];
			p.position = 'absolute';
			node.push(<img src={item} width={s.width} height={s.height} style={p} key={'img'+index}/>)
		});
		return(
			<div style={{width:'100%',position:'absolute',top:0,left:0,transform:transform}}>{node}</div>
		)
	}
	
}

class ImageComponent extends React.Component {
	render() {
		var props = this.props;
		var src = props.src;
		var size = props.size;
		var pos = props.pos;
		
		pos.transform = props.styleObj || '';
		pos.position = 'absolute';
		return (
			<img src={src} width={size?size.width:''} height={size?size.height:''} style={pos}/>
		)
	}
}


//== @ data: Array
//==	size: Object || Array 大小
//==	range: Array 范围
//==	src: Object || Array 地址
//==	down: Boolean 是否反向
//==	pos: Object || Array 位置

class MovedivComponent extends React.Component {

	constructor(props) {
		super();
		this.state = {
			styleObj: []
		};
	}
	pagePos(e) {
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
	}

	offset(elm) {
		var offsetX = 0, offsetY = 0;
		do {
			offsetX += elm.offsetLeft;
			offsetY += elm.offsetTop;
		} while ((elm = elm.offsetParent) && (elm.tagName !== 'BODY'))
		return {
			x: offsetX,
			y: offsetY
		}
	}

	move(elmX, elmY, range, down) {
		var movediv = this.refs.movediv;
		var w = (this.props.width || movediv.scrollWidth) / 2,
			h = (this.props.height || movediv.scrollHeight) / 2;
		var i = 1;
		if(down) {
			i = -1;
		}
		var left = range.left || 0, top = range.top || 0;
		var x = i * (left * elmX / w - left),
			y = i * (top * elmY / h - top);
		var result = 'translateX(' + x + 'px) translateY(' + y + 'px)';
		return result;
	}

	handleMouseMove(e) {
		var movediv = this.refs.movediv;
		var pagePos = this.pagePos(e);
		var pageX = pagePos.x,
			pageY = pagePos.y;
		var offset = this.offset(movediv);
		var offsetX = offset.x,
			offsetY = offset.y;
		var x = pageX - offsetX,
			y = pageY - offsetY;
		var data = this.props.data;
		var styleObj = [];
		data.forEach(function(item) {
			var range = item.range;
			var down = item.down || false;
			var _style = this.move(x, y, range, down);
			styleObj.push(_style);
		}.bind(this))
		this.setState({
			styleObj: styleObj
		})

	}

	render() {
		var props = this.props;
		var data = props.data;
		var width = props.width;
		var height = props.height;
		var node = [];
		if(data.length && util.type(data) == 'Array') {
			data.forEach(function(item, index) { // 遍历数组;
				if(util.type(item) == 'Object') {
					var src = item.src;
					var size = item.size;
					var pos = item.pos;
					if(util.type(src) == 'Array') {
						node.push(<ImagesComponent src={src} size={size} pos={pos} styleObj={this.state.styleObj[index]} key={'imgC'+index}/>)
					} else {
						node.push(<ImageComponent src={src} size={size} pos={pos} styleObj={this.state.styleObj[index]} key={'imgC'+index}/>)
					}
				}
			}.bind(this))
		}
		var _style = this.props.styleObj;
		_style.overflow = 'hidden';
		return(
			<div className="movediv" onMouseMove={this.handleMouseMove.bind(this)} style={_style} ref="movediv">
				{node}
			</div>
		)
	}
}

export default MovedivComponent;