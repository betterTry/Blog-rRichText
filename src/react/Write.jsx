import React from 'react';
import ReactDOM from 'react-dom';

import {util} from '../libs';
const $ = {
	ajax: require('reqwest')
}
var xss = require('xss');

class FontInfoComponent extends React.Component {
	render() {
		return (
			<div className="fontInfoBox"><span className="fontInfoTriangle"></span><span className="fontInfo">{this.props.text}</span></div>
		)
	}
}

class SavedComponent extends React.Component {
	render() {
		return (
			<div className="saveState"><span>{this.props.save ? '已保存': '未保存'}</span></div>
		)
	}
}

class UploadMessage extends React.Component {
	render() {
		return(
			<div className="uploadMessage" style={this.props.upload ?{opacity:0,visibility: 'visible'}:{}}>
				<span className="rightIcon"></span><span>已上传</span>
			</div>
		)
	}
}

class UploadComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			upload: false
		}
	}
	handleChange(e) {
		var data = new FormData();
		var file = e.target.files[0];
		if(file.type.indexOf('image') > -1) {
			if(file.size <= 300000) { // 图片是否过大;
				data.append('pic', file);
				$.ajax({
					url: '/update/pic',
					method: 'POST',
					data: data,
					contentType: false,
					processData: false,
					success: function(result) {
						if(result.success) {
							// 显示已上传并关闭框;
							var selection = document.getSelection();
							var link = result.img;
							if(selection.anchorNode.tagName == 'P' && selection.isCollapsed){
								document.execCommand('InsertImage',false, link);
							} else {
								document.execCommand('insertParagraph');
								document.execCommand('InsertImage',false, link);
								document.execCommand('formatBlock', false, '<p>');
								document.execCommand('insertParagraph');
							}
							this.setState({
								upload: true
							})
						}
					}.bind(this)
				})
			} else { //图片过大提示信息;

			}
			
		} else { // 如果不是,提示信息;

		}
		
	}
	render() {
		return (
			<div>
				<input type="file" name="pic" ref="updateFile" onChange={this.handleChange.bind(this)} onClick={(e) => {e.stopPropagation()}} />
				<UploadMessage upload={this.state.upload}/>
			</div>
		)
	}
}

class Publishli extends React.Component {
	constructor(props) {
		super();
		this.state = {
			hover: false,
			publish: false
		}
	}

	handleMouseover() {
		var publish = this.props.publish;
		if(publish) {
			this.setState({
				publish: true
			})
		} else {
			this.setState({
				hover: true
			})
		}
	}
	handleMouseout() {
		this.setState({
			publish: false,
			hover: false
		})
	}

	render() {
		var publish = this.props.publish;
		var hover = this.state.hover;
		if(this.state.publish) {
			var styleObj = {display: 'block'};
		} else {
			var styleObj = {display: 'none'};
		}
		return(
			<li className={"publishArticle fr" + (hover ? ' menu-active':'')} ref="publishArticle" onClick={publish ? this.props.handleCanclePublish : this.props.handleClickPublish} onMouseOver={this.handleMouseover.bind(this)} onMouseOut={this.handleMouseout.bind(this)}>
				<span className="publishIconN" ref="publishIcon">{publish ? '已发布':'发布文章'}</span>
				<span className="publishIconHover publishIconC" style={styleObj}>取消发布</span>
			</li>
		)
	}
}

class InputComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			value: props.text || props.link || '',
			change: false
		}
	}
	
	handleChange(e) {
		this.setState({
			value: e.target.value,
			change: true
		})
	}

	render() {
		return(
			<input type="text" className="modelInput" onChange={this.handleChange.bind(this)} onFocus={this.props.changeNoValue} value={this.state.value} />
		)
	}
}

class ModelComponent extends React.Component {

	constructor(props) {
		super();
		this.state = {
			local: true,
			no: false
		};
	}

	componentDidMount() {
		window.addEventListener('click', this.props.clickListener);
	}
	添加链接;
	createLink() {
		var InputComponentLink = this.refs.InputComponentLink.state,
			InputComponentWord = this.refs.InputComponentWord.state;
		var link = InputComponentLink.value,
			word = InputComponentWord.value;
		var LC = InputComponentLink.change,
			WC = InputComponentWord.change;

		var props = this.props;
		props.changeState();
		var elm = props.elm;
		var index1 = link.indexOf('http://');
		var index2 = link.indexOf('https://');
		if((index1 !== 0) && (index2!==0)) {
			link = 'http://' + link;
		}
		var selection = document.getSelection();
		if(elm) {// 如果存在a标签;
			if(WC) {
				elm.textContent = word;
			}
			elm.href = link;
			selection.collapse(elm.firstChild, word.length);
		} else {// 如果a标签不存在;
			// 重新查找selection;
			
			var anchorNode = selection.anchorNode;

			var a = document.createElement('a');
				a.href = link;
				a.textContent = word;
			if(anchorNode.nodeType == 1){// 如果没有选取的内容;
				anchorNode.appendChild(a);
			} else {
				var begin = selection.anchorOffset,
					end = selection.focusOffset;
				var content = anchorNode.textContent;
				var frag = document.createDocumentFragment();
				var node1 = document.createTextNode(content.slice(0, begin));
				var node2 = document.createTextNode(content.slice(end));
				frag.appendChild(node1);
				frag.appendChild(a);
				frag.appendChild(node2);
				anchorNode.parentNode.replaceChild(frag, anchorNode);
			}
			selection.collapse(a.firstChild, word.length);
		}
	}
	// 添加图片;
	createPic() {
		var state = this.state;
		var props = this.props;
		props.changeState();

		var InputComponentLink = this.refs.InputComponentLink.state;
		var link = InputComponentLink.value;
		if(!link) { // 如果值为空;
			this.setState({
				no: true
			})
		} else { // 如果有值;
			var selection = document.getSelection();
			if(selection.anchorNode.tagName == 'P' && selection.isCollapsed){
				document.execCommand('InsertImage',false, link);
			} else {
				document.execCommand('insertParagraph');
				document.execCommand('InsertImage',false, link);
				document.execCommand('formatBlock', false, '<p>');
				document.execCommand('insertParagraph');
			}
		}
	}

	changeNoValue() {
		var no = this.state.no;
		if(no) {
			this.setState({
				no: false
			})
		}
	}

	handleUpdate(e) {
		e.preventDefault();
		e.stopPropagation();
		var UploadComponent = this.refs.UploadComponent;
		var file = UploadComponent.refs.updateFile;
		file.click();
	}

	switchLocal(e) {
		e.preventDefault();
		e.stopPropagation();
		var local = this.state.local ? false : true;
		this.setState({
			local: local
		})
	}
	
	render() {
		var props = this.props;
		var title = '插入', node = [];

		if(props.type == 'word') {
			title += '链接';
			node.push(<div className="inputBox" key='word1'><InputComponent ref="InputComponentLink" link={props.link}/><span className="iconSpan iconSpanLink"></span></div>);
			node.push(<div className="inputBox" key='word2'><InputComponent ref="InputComponentWord" text={props.text}/><span className="iconSpan iconSpanWord"></span></div>);
			var handleClick = this.createLink.bind(this); 
		} else if(props.type == 'pic') {
			title += '图片';
			var state = this.state;
			var local = state.local;
			if(local) {
				node.push(<div className="switchLocal" key="12"><a href="#" style={{color:'#1e90ff'}} onClick={(e) => {this.switchLocal(e)}}>本地图片</a>或者<a href="#" onClick={(e) => {this.switchLocal(e)}}>网络图片</a></div>)
				node.push(<div className="updateBox" key="34"><a href="#" onClick={(e) => {this.handleUpdate(e)}}>上传图片</a><UploadComponent ref="UploadComponent"/></div>)
				
			} else {
				node.push(<div className="switchLocal" key="12"><a href="#" onClick={(e) => {this.switchLocal(e)}}>本地图片</a>或者<a href="#" onClick={(e) => {this.switchLocal(e)}} style={{color:'#1e90ff'}}>网络图片</a></div>)
				var className = "inputBox" + (state.no ? ' inputBoxNo' : '');
				node.push(<div className={className} key="34"><InputComponent ref="InputComponentLink" changeNoValue={this.changeNoValue.bind(this)}/><span className="iconSpan iconSpanLink"></span></div>);
			}
			var handleClick = this.createPic.bind(this);
		}
		var spanEnter = <span className="modelC" onClick={handleClick}>确认</span>;
		if((props.type == 'pic') && this.state.local) spanEnter = '';

		return (
			<div className="modelBox" id="modelBox">
				<div>
					<h1>{title}</h1>
					{node}
				</div>
				
				<div style={{textAlign: 'right',paddingTop:10}}>
					<span className="modelC" onClick={props.changeState}>取消</span>
					{spanEnter}
				</div>
			</div>
		)
	}
}



class ControlWriteComponent extends React.Component {


	constructor(props) {
		super();
		var index = props.index;
		var data = props.data;
		this.state = {
			type: '',
			text: '',
			link: '',
			elm: '',
			shift: false
		};
		this.clickListener = this.clickListener.bind(this);
		this.changeSave = this.changeSave.bind(this);
		this.pasteWrite = this.pasteWrite.bind(this);
		this.focus = false;
		this.pre = false;
	}
	shouldComponentUpdate(nextProps) {
		return true;
	}
	
	islastchild(node) {
		var lastChild = true;
		do{
			if(node.nextSibling) {
				lastChild = false;
				break;
			}
		} while((node = node.parentNode) && node.parentNode.tagName !== 'DIV')
		
		return lastChild;
	}

	handleFocus() {
		this.focus = true;
		var controlWrite = this.refs.controlWrite;
		
		controlWrite.addEventListener('DOMSubtreeModified',this.changeSave);
	}

	handleBlur() {
		this.focus = false;
	}

	format(type, value) {
		document.execCommand(type, false, value);
		this.refs.controlWrite.focus();
	}

	handleClick(e, type, value) {
		e.preventDefault();
		if(this.isPreCode()) {
			return false;
		}
		this.format(type, value);
	}

	handleClickQuote(event) {
		event.preventDefault();
		if(this.isPreCode()) {
			return false;
		}
		if(this.focus) {
			var controlWrite = this.refs.controlWrite;
			var node = this.findNode();

			if(node.tagName !== 'BLOCKQUOTE') {
				if(!node.textContent) {
					if(this.isLastChild(node)) {
						var p = this.createP();
						controlWrite.appendChild(p);
					}

					document.execCommand('formatBlock', false, 'BLOCKQUOTE');
					document.execCommand('insertHTML', false , '<p><br/></p>');

				} else {
					var selection = window.getSelection();
					var range = selection.getRangeAt(0);
					var startContainer = range.startContainer,
						startOffset = range.startOffset,
						endContainer = range.endContainer,
						endOffset = range.endOffset;
					if(this.isLastChild(node)) {
						var p = this.createP();
						controlWrite.appendChild(p);
					}

					var blockquote = document.createElement('blockquote');
					blockquote.appendChild(controlWrite.replaceChild(blockquote, node));
					
					range.setStart(startContainer, startOffset);
					range.setEnd(endContainer, endOffset);
					selection.removeAllRanges();
					selection.addRange(range);
					
				}
			} else { // 取消blockquote;
				if(!node.textContent) {
					controlWrite.removeChild(node);
					document.execCommand('formatBlock', false, 'p');
				} else {
					var selection = window.getSelection();
					var range = selection.getRangeAt(0);
					var startContainer = range.startContainer,
						startOffset = range.startOffset,
						endContainer = range.endContainer,
						endOffset = range.endOffset;

					var childrens = node.childNodes;
					var frag = document.createDocumentFragment();

					childrens.forEach(function(item, value) {
						frag.appendChild(item);
					})
					controlWrite.replaceChild(frag, node);
					
					range.setStart(startContainer, startOffset);
					range.setEnd(endContainer, endOffset);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		}
	}

	handleClickH(e, value) {
		e.preventDefault();
		e.stopPropagation();
		if(this.isPreCode()) {
			return false;
		}
		if(this.focus) {
			var node = this.findNode();
			var tag = node.tagName;
			var patt = new RegExp(tag, 'i');
			var tag2 = this.findNode('BLOCKQUOTE');
			var patt1 = new RegExp(tag2.tagName, 'i');

			if(patt.test(value) || patt1.test(value)) {
				// 如果存在,格式化为P;
				this.format('formatBlock', '<p>');
			} else {
				// 不存在,格式化为设置值;
				if(this.isLastChild(node)) {
					var p = this.createP();
					controlWrite.appendChild(p);
				}
				this.format('formatBlock', value);
			}
		}
	}

	findNode(elm, value) {
		var par = 'DIV'
		if(elm && !value) {
			par = elm;
		}
		
		if(!value) {
			var selection = window.getSelection();
			var node = selection.anchorNode;
		} else {
			var node = elm;
		}
		while((node.parentNode.tagName !== 'DIV') && (node.parentNode.tagName !== par)) {
			node = node.parentNode;
		}
		return node;
	}

	isLastChild(elm) {
		var controlWrite = this.refs.controlWrite;
		return (elm === controlWrite.lastChild) ? true : false;
	}

	createP() {
		var p = document.createElement('p');
		p.appendChild(document.createElement('br'));
		return p;
	}

	handleClickSave(event) {
		event.preventDefault();
		var data = this.props.data, index = this.props.index;
		var controlWrite = this.refs.controlWrite;
		var html = controlWrite.innerHTML;
		
		
		var _data = data[index[0]].articles[index[1]];
		var article = _data._id, title = _data.name;
		$.ajax({
			url: '/write/save',
			method: 'POST',
			data: {
				article: article,
				title: title,
				content: html,
			},
			success: function (result) {
				if(result.success) {
					this.props.changeContent(html);
					this.props.changeSave();
				}
			}.bind(this)
		})
	}

	handleClickPublish() {
		var data = this.props.data, index = this.props.index;
		var controlWrite = this.refs.controlWrite;
		var html = controlWrite.innerHTML;
		var img = controlWrite.getElementsByTagName('img');
		var text = controlWrite.textContent.replace(/\s/g, '');
		if(text.length > 87) {
			text = text.slice(0, 86) + '...';
		}

		if(img.length) {
			img = img[0].src;
		} else {
			img = '';
		}

		var _data = data[index[0]].articles[index[1]];
		var article = _data._id, title = _data.name;
		$.ajax({
			url: '/write/publish',
			method: 'POST',
			data: {
				article: article,
				title: title,
				content: html,
				img: img,
				text: text
			},
			success: function (result) {
				if(result.success) {
					this.props.changePublish(true);
				}
			}.bind(this)
		})
	}
	handleCanclePublish() {
		var data = this.props.data, index = this.props.index;
		var _data = data[index[0]].articles[index[1]];
		var id = _data._id;
		$.ajax({
			url: '/write/cpublish?id=' + id,
			method: 'GET',
			success: function (result) {
				if(result.success) {
					this.props.changePublish(false);
				}
			}.bind(this)
		})
	}

	handleClickCode(e) {
		e.preventDefault();
		e.stopPropagation();
		if(this.isPreCode()) {
			return false;
		}
		if(this.focus) {
			var node = this.findNode();
			var pre = document.createElement('pre');
			var code = document.createElement('code');
			var br = document.createElement('br');
			code.appendChild(br);
			pre.appendChild(code);
			var par = node.parentNode;
			var nextSibling = node.nextSibling;
			
			if(nextSibling) {
				par.insertBefore(pre, nextSibling,);
			} else {
				par.appendChild(pre);
			}

			var selection = document.getSelection();
			selection.collapse(code, 0);
		}

	}
	codeFocus(e) {
		
	}
	codeKeyDown(e) {
		e.stopPropagation();
		if(e.keyCode == 13) {
			var selection = document.getSelection();
			if(!selection.isCollapsed) {
				document.execCommand('delete');
			}
			var anchorNode = selection.anchorNode;
			var anchorOffset = selection.anchorOffset;
			var textContent = anchorNode.textContent;
			anchorNode.textContent = textContent.slice(0, anchorOffset) + '\r\n' + textContent.slice(anchorOffset);
			selection.collapse(anchorNode, anchorOffset + 2);

			e.preventDefault();
		}
	}
	handleKeyDown(e) { //ctrl+s;
		if(e.ctrlKey && (e.keyCode == 83)) {
			e.preventDefault();
			this.handleClickSave(e);
		}
	}

	handleMouseover(e, value) {
		this.refs[value].className += ' menu-active';
	}
	

	handleMouseout(e, value) {
		this.refs[value].className = this.refs[value].className.replace(/ menu-active/,'');
	}

	handleshow(value) {
		this.refs[value].className += ' menu-show';
	}
	handlehidden(value) {
		this.refs[value].className = this.refs[value].className.replace(/ menu-show/,'');
	}
	handleHr(e) {
		e.preventDefault();
		if(this.isPreCode()) {
			return false;
		}
		document.execCommand('insertHorizontalRule', true);
		this.format('formatBlock', '<p>');
	}
	handleFullScreen(e) {
		e.preventDefault();
		this.props.fullscreen();
	}

	handleLink(e, value) {
		e.preventDefault();
		e.stopPropagation();
		if(this.isPreCode()) {
			return false;
		}
		if(this.focus) {
			var type = this.state.type;
			var selection = document.getSelection();
			var range = selection.getRangeAt(0);
			var startContainer = range.startContainer,
				startOffset = range.startOffset,
				endContainer = range.endContainer,
				endOffset = range.endOffset;
			//已经存在的文字和link;
			var text = '', link = '', elm = '';
			if(type) { // 如果已经存在,则关闭;
				// 设置type为空;
				value = '';
			} else {
				var anchorNode = selection.anchorNode,
					focusNode = selection.focusNode;
				if(anchorNode !== focusNode) { // 检查是否跨标签;
					//检查是否有a标签
					var nodeP = range.commonAncestorContainer;
					var a = nodeP.getElementsByTagName('a');
					var a_length = a.length;
					if(a_length || (nodeP.tagName == 'A')) { // 如果 a 存在;
						var a_node = a[0] || nodeP;
						// 设置初始值;
						link = a_node.href;
						text = a_node.textContent;
						//设置 a 为新的选择点;
						startContainer = endContainer = a_node;
						startOffset = endOffset = 0;
						elm = a_node;

					} else { // 否则光标回到最初的位置;
						selection.collapseToStart();
					}
				} else { // 如果没有跨标签;
					// 检查当前是否被a元素包围;

					if(anchorNode.nodeType !== 1) { // 如果有内容;
						if(anchorNode.parentNode.tagName !== 'A') {
							text = anchorNode.textContent.slice(startOffset, endOffset);
						} else {
							do { // 循环赋值向上查询;
								anchorNode = anchorNode.parentNode;
								var tagName = anchorNode.tagName;
							} while(/B|I|STRIKE/.test(tagName)) // 检查当前文本的父元素是否为这三者;
							if(tagName == 'A') { //检查是否为 a;
								link = anchorNode.href;
								text = anchorNode.textContent;
								elm = anchorNode;
							}
						}
						
					} 

					// 设置text为选中的文字;
					text = text || anchorNode.textContent.slice(startOffset, endOffset);
				}
			}
			this.selection = {
				startContainer: startContainer,
				startOffset: startOffset,
				endContainer: endContainer,
				endOffset: endOffset
			}
			this.setState({
				type: value,
				text: text,
				link: link,
				elm: elm
			})
		}
		
	}

	handlePaste(e) {
		var pasteWrite = this.refs.pasteWrite;
		var controlWrite = this.refs.controlWrite;
		var node = this.findNode();
		var selection = document.getSelection();
		
		if(!selection.isCollapsed) {
			document.execCommand('delete');
		}

		var anchorNode = selection.anchorNode;
		var anchorOffset = selection.anchorOffset;
		this.anchorNode = anchorNode;
		this.anchorOffset = anchorOffset;

		if(node.tagName == 'PRE') {
			this.pre = true;
		}
		if(!this.copy) { //如果不是在编辑器中进行复制;
			pasteWrite.focus();
		}
		
	}

	handleCopy(e) {
		this.copy = true;
	}

	pasteFocus(e) {
		e.stopPropagation();
		var pasteWrite = this.refs.pasteWrite;
		pasteWrite.addEventListener('DOMNodeInserted', this.pasteWrite)
	}
	pasteWrite(e) {
		var options = {
			whiteList: {
				a: ['href', 'title', 'target'],
				img: ['alt', 'src'],
				p: '',
				b: '', strike: '', i: '',
				br: ''
			},
			onIgnoreTag: function(tag, html, options) {
				// return 的，全部替换;
				if(/(div)|(ol)|(tbody)|(table)|(td)|(th)|(strong)|(ul)|(dl)|(span)|(em)|(label)|(code)|(small)|(select)|(dir)|(font)|(sup)|(tt)|(sub)|(abbr)|(acronym)|(cite)|(big)/i.test(tag)) {
					return ''
				}
				// 否则全部escape;
			},
			stripIgnoreTagBody: ['script', 'iframe', 'frame', 'input', 'textarea', 'form', 'hr'],
			escapeHtml: function(html) {
				// 全部变成p标签;
				return html.replace(/<\w.*?>/,'<p>').replace(/<\/.*?>/,'</p>');
			}
		}
		var myxss = new xss.FilterXSS(options);
		var pasteWrite = this.refs.pasteWrite;
		pasteWrite.removeEventListener('DOMNodeInserted', this.pasteWrite);
		setTimeout(function() {

			// 插入的位置, 粘贴之前保存的位置;
			var offset = this.anchorOffset;
			var anchorNode = this.anchorNode;
			if(this.pre) {
				var content = pasteWrite.textContent;
				if(anchorNode.nodeType == 1) {
					anchorNode.innerHTML = content;
				} else {
					anchorNode.textContent = anchorNode.textContent.slice(0, offset) + content + anchorNode.textContent.slice(offset);
				}
				this.pre = false;
				pasteWrite.innerHTML = '';
				return;
			}
			
			var controlWrite = this.refs.controlWrite;

			var _h = pasteWrite.innerHTML; // 第一次获取paste的值;

			// 如果是纯文本，则不进行剔除;
			if(_h == pasteWrite.textContent) {
				
				var textContent = anchorNode.textContent;
				var tlength = textContent.length; //要复制内容的长度;

				var selection = document.getSelection();
				if(textContent) {
					console.log(textContent)
					anchorNode.textContent = textContent.slice(0, offset)+_h+textContent.slice(offset);
					
					
					selection.collapse(anchorNode, _h.length+offset); // 光标定位;
				} else {
					anchorNode.textContent = _h;
					selection.collapse(anchorNode, 1);
				}
				

			} else { // 若不是纯文本,进行筛选;
				
	
				var html = myxss.process(pasteWrite.innerHTML);
				html = html.replace(/<p><\/p>/g,'').replace(/<p>(?=<p>)/g,'').replace(/<\/p>(?=<\/p>)/g, '').replace(/<\w+?><\/\w+?>/,'')
				
				pasteWrite.innerHTML = html; // 让文本在paste中进行缓存;
				var _hh = pasteWrite.innerHTML; // 缓存innerHTML对象;
				// 此时对selection进行缓存;
				var selection = document.getSelection();
				selection.selectAllChildren(pasteWrite);
				selection.collapseToEnd();
				this.anchorNode = selection.anchorNode; // 重新记录anchorNode以及anchorOffset;
				this.anchorOffset = selection.anchorOffset; // 此时都在paste中，用于重新确定位置;
				
				var childNodes = pasteWrite.childNodes;
				var clength = childNodes.length;
				var c = []; // 让nodelist数组化;
				for(var i = 0; i < clength; i++) { // 插入到数组;
					var _childNode = childNodes[i];
					c.push(_childNode);
				}

				var frag = document.createDocumentFragment();
				for(var i = 0; i < clength; i++) { // 插入到碎片;
					frag.appendChild(c[i]);
				}


				if(!/<p>|<img/.test(_hh)) {	// 如果不含P和img,全部加入anchorNode中;
					console.log('not p');
					if(anchorNode.nodeType == 1) {
						var _ac = anchorNode.firstChild;
						if(_ac) { // 如果里面有空元素，替换掉;
							anchorNode.replaceChild(frag, _ac);
						} else {
							anchorNode.appendChild(frag);
						}
					} else{
						var textContent = anchorNode.textContent;
						if(offset == textContent.length) {
							var nextSibling = anchorNode.nextSibling;
							if(nextSibling) {
								anchorNode.parentNode.insertBefore(frag, nextSibling);
							} else {
								anchorNode.parentNode.appendChild(frag);
							}
						} else {
							var text1 = document.createTextNode(textContent.slice(0, offset));
							var text2 = document.createTextNode(textContent.slice(offset));
							var _frag = document.createDocumentFragment();
							_frag.appendChild(text1);
							_frag.appendChild(frag);
							_frag.appendChild(text2);
							anchorNode.parentNode.replaceChild(_frag, anchorNode);
						}
						
					}
					
				} else { // 如果是P,则将第一个P插入到原来中，其他的全部以节点加入;
					console.log('IS P');
					// 首先将br标签之前，p标签之后的元素全部放在一个P中;
					var childNodes_cache = [];
					for(var i = 0; i < clength; i++) {
						var _cacheItem = c[i];
						var _cacheFrag = document.createElement('p');
						if(_cacheItem.tagName == 'P') {
							var _cacheLength = childNodes_cache.length;

							if(_cacheLength) {
								var _cItem;
								while(_cItem = childNodes_cache.shift()) {
									_cacheFrag.appendChild(_cItem);
								}

								frag.insertBefore(_cacheFrag, _cacheItem)
							}
						} else if( _cacheItem.tagName == 'BR') {
							var _cItem;
							while(_cItem = childNodes_cache.shift()) {
								_cacheFrag.appendChild(_cItem);
							}
							frag.replaceChild(_cacheFrag, _cacheItem);
						} else {
							childNodes_cache.push(_cacheItem)
						}
					}
					
					var firstNode = frag.removeChild(frag.firstChild); // paste节点的第一个节点;
					var firstText = firstNode.innerHTML || firstNode.textContent;
					var anchorNode = this.addTextContent(anchorNode, offset, firstText); // 添加第一个节点的文本;
					

					// 后面通过findNode找到元素，在其后面添加其他文本;
					var currentNode = this.findNode(anchorNode, true);
					
					
					var nextSibling = currentNode.nextSibling;
					if(!nextSibling || currentNode.tagName == 'div') {
						controlWrite.appendChild(frag);
					} else {
						controlWrite.insertBefore(frag, nextSibling);
					}
				}
				var selection = document.getSelection();
				selection.collapse(this.anchorNode, this.anchorOffset);

			}
			
			pasteWrite.innerHTML = '';
			console.log(pasteWrite.innerHTML)
		}.bind(this), 0)
		
	}

	// 添加内容;
	// @params node: 目标节点; offset:偏移位置; value: 值;
	// @return false: 目标为元素节点; true: 文本节点;
	addTextContent(node, offset, value) {
		if(node.nodeType == 1) { // 第一段无缝添加;

			node.innerHTML = value;
			var _r = node;
		} else if(node.nodeType == 3) {
			var textContent = node.textContent;
			var _r = node.parentNode;
			_r.innerHTML = _r.innerHTML.replace(textContent, textContent.slice(0, offset) + value + textContent.slice(offset));

		}
		return _r;
	}
 
	changeState(e) {
		if(e) {
			e.stopPropagation();
			e.preventDefault();
		}
		window.removeEventListener('click', this.clickListener);
		this.setState({
			type: '',
			link: '',
			word: '',
			a: ''
		})
		var selection = document.getSelection();
		var _selection = this.selection;
		var range = selection.getRangeAt(0);
		range.setStart(_selection.startContainer, _selection.startOffset);
		range.setEnd(_selection.endContainer, _selection.endOffset);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	clickListener(e) {
		e.stopPropagation();
		var node = document.getElementById('modelBox');
		if(node) {
			var x = e.pageX,
				y = e.pageY;
			var _x = 0, _y = 0;
			var width = node.offsetWidth, height = node.offsetHeight;
			do {
				_x += node.offsetLeft;
				_y += node.offsetTop;
			} while((node = node.offsetParent) && node.tagName !== 'BODY')
			if(x < _x || x > (_x + width) || y < _y || y > (_y + height)){
				this.changeState();
			}
		}
	}

	handlePic(e, value) {
		e.preventDefault();
		e.stopPropagation();
		if(this.isPreCode()) {
			return false;
		}
		var selection = document.getSelection();
		var range = selection.getRangeAt(0);

		var startContainer = range.startContainer,
			startOffset = range.startOffset,
			endContainer = range.endContainer,
			endOffset = range.endOffset;
		this.selection = {
			startContainer: startContainer,
			startOffset: startOffset,
			endContainer: endContainer,
			endOffset: endOffset
		}
		if(this.focus) {
			var type = this.state.type;
			if(type) {
				value = '';
			} 
			
			this.setState({
				type: value
			})
		}
	}


	changeSave() {
		var data = this.props.data, index = this.props.index;
		if(data[index[0]].articles[index[1]].save == false) {
			return ;
		} else {
			this.props.changeSave(false);
		}
	}

	noshiftEnter(e) {
		if(e.keyCode == 13) {
			var selection = document.getSelection();
			var anchorNode = selection.anchorNode;
			if(anchorNode.tagName == 'CODE' || anchorNode.parentNode.tagName == 'CODE'){
				if(e.shiftKey) {
					var node = anchorNode.tagName == 'CODE' ? anchorNode.parentNode : anchorNode.parentNode.parentNode;
					var br = document.createElement('br');
					var p = document.createElement('p');
					p.appendChild(br);
					var nextSibling = node.nextSibling;
					if(nextSibling) {
						node.parentNode.insertBefore(p, nextSibling);
					} else {
						node.parentNode.appendChild(p);
					}
					selection.collapse(p, 0);

				} else {
					// 如果在code中;
					if(!selection.isCollapsed) {
						document.execCommand('delete');
					}
					var anchorNode = selection.anchorNode;
					
					var anchorOffset = selection.anchorOffset;
					var textContent = anchorNode.textContent;
					if(textContent) {
						anchorNode.textContent = textContent.slice(0, anchorOffset) + '\r\n' + textContent.slice(anchorOffset);
						selection.collapse(anchorNode, anchorOffset + 2);
					} else {
						var textNode = document.createTextNode('\r\n');
						anchorNode.appendChild = textNode;

						selection.collapse(textNode, 2);
					}
				}

				e.preventDefault();
			} else { // 默认模式;
				// document.execCommand('insertParagraph');
				// document.execCommand('formatBlock', false, '<p>');
				// e.preventDefault();
			}
		} else if(e.keyCode == 8) {
			var child = controlWrite.childNodes;
			
			if ((child.length == 1) && !child[0].textContent && child[0].childNodes.length <= 1) {
				if(child[0].tagName === 'P'){}
				else{
					controlWrite.removeChild(child[0]);
					document.execCommand('formatBlock', false, '<p>')
				}
				
			} else {
				document.execCommand('delete');
			}
			e.preventDefault();
		} else if(e.keyCode == 9) {
			var selection = document.getSelection();
			var anchorNode = selection.anchorNode;
			if(anchorNode.tagName == 'CODE' || anchorNode.parentNode.tagName == 'CODE'){
				// 如果在code中;
				if(!selection.isCollapsed) {
					document.execCommand('delete');
				}
				document.execCommand('insertText', false, '    ');

				e.preventDefault();
			}
		}
	}

	shiftEnter(e) {
		if(e.keyCode == 13) {
			var selection = document.getSelection();
			// 当选取存在内容时，首先清除内容;
			if(!selection.isCollapsed) {
				document.execCommand('delete');
			}
			
			if(e.shiftKey) {
				var anchorNode = selection.anchorNode;
				if(anchorNode.tagName == 'CODE' || anchorNode.parentNode.tagName == 'CODE') {
					var node = anchorNode.tagName == 'CODE' ? anchorNode.parentNode : anchorNode.parentNode.parentNode;
					var br = document.createElement('br');
					var p = document.createElement('p');
					p.appendChild(br);
					var nextSibling = node.nextSibling;
					if(nextSibling) {
						node.parentNode.insertBefore(p, nextSibling);
					} else {
						node.parentNode.appendChild(p);
					}
					selection.collapse(p, 0);
				} else {
					document.execCommand('insertParagraph');
					document.execCommand('formatBlock', false, '<p>');
				}
			} else {
				var node = selection.anchorNode;
				var br = document.createElement('br');
				var nodeType = node.nodeType;
				var anchorOffset = selection.anchorOffset;
				if(node.tagName == 'CODE' || node.parentNode.tagName == 'CODE') {
					// 如果是code;
					var textContent = node.textContent;
					if(textContent) {
						node.textContent = textContent.slice(0, anchorOffset) + '\r\n' + textContent.slice(anchorOffset);
						selection.collapse(node, anchorOffset + 2);
					} else {
						node.textContent = '\r\n';
						selection.collapse(node, 2);
					}
					
				} else {
					if(nodeType == 1) {
					node.appendChild(br);
					selection.collapse(node, anchorOffset+1);
					} else if(nodeType == 3) {
						
						var parentNode = node.parentNode;
						var partext = parentNode.textContent;
						var textContent = node.textContent;
						var focusOffset = selection.focusOffset;
						var nextSibling = node.nextSibling;
						var frag = document.createDocumentFragment();

						if(focusOffset == textContent.length) { // 当光标在节点的最后时;
							if(partext == textContent && !nextSibling) { // 此时一定是最后元素，最常见情况,优化;
								var br2 = br.cloneNode(br);
									frag.appendChild(br);
									frag.appendChild(br2);
									parentNode.appendChild(frag);
									selection.collapse(parentNode, parentNode.childNodes.length);
							} else { // 如果不是上述情况，再遍历DOM,是否为最后元素；
								var lastChild = this.islastchild(node);
								if(lastChild) {
									var br2 = br.cloneNode(br);
									frag.appendChild(br);
									frag.appendChild(br2);
									parentNode.appendChild(frag);
									selection.collapse(parentNode, parentNode.childNodes.length);
								} else {
									var _node = node.cloneNode();
									frag.appendChild(_node);
									frag.appendChild(br);
									parentNode.replaceChild(frag, node);
									var childNodes = parentNode.childNodes;
									var length = childNodes.length;
									for(var i = 0; i < length; i++) {
										if(childNodes[i] == br) break;
									}
									selection.collapse(parentNode, i+1);
								}
							}

						} else { // 当光标在中间或者开始时;
							var text1 = document.createTextNode(textContent.slice(0, anchorOffset));
							var text2 = document.createTextNode(textContent.slice(anchorOffset));
							frag.appendChild(text1);
							frag.appendChild(br);
							frag.appendChild(text2);
							parentNode.replaceChild(frag, node);
							selection.collapse(text2, 0);
						}
					}
				}
				
			}
			e.preventDefault();
		} else if(e.keyCode == 8) {
			var child = controlWrite.childNodes;
			if ((child.length == 1) && !child[0].textContent && child[0].childNodes.length <= 1) {
				if(child[0].tagName === 'P'){}
				else{
					controlWrite.removeChild(child[0]);
					document.execCommand('formatBlock', false, '<p>')
				}
				e.preventDefault();
			}
		} else if(e.keyCode == 9) {
			var selection = document.getSelection();
			var anchorNode = selection.anchorNode;
			if(anchorNode.tagName == 'CODE' || anchorNode.parentNode.tagName == 'CODE'){
				// 如果在code中;
				if(!selection.isCollapsed) {
					document.execCommand('delete');
				}
				document.execCommand('insertText', false, '    ');

				e.preventDefault();
			}
		}
	}

	handleShift(e) {
		e.preventDefault();
		if(this.isPreCode()) {
			return false;
		}
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		var startContainer = range.startContainer,
			startOffset = range.startOffset,
			endContainer = range.endContainer,
			endOffset = range.endOffset;


		var shift = this.state.shift ? false : true;
		this.setState({
			shift: shift
		})
		range.setStart(startContainer, startOffset);
		range.setEnd(endContainer, endOffset);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	isPreCode() {
		var node = this.findNode();
		if(node.tagName == 'PRE') {
			return true;
		}
		return false;
	}

	render() {
		var state = this.state;
		var data = this.props.data, index = this.props.index;
		var length = index[1];
		if(length > -1) {
			var publish = data.length ? data[index[0]].articles[index[1]].publish : '';
		} else{
			var publish = '';
		}
		
		if(state.shift) {
			var handleShift = this.shiftEnter.bind(this);
		} else {
			var handleShift = this.noshiftEnter.bind(this);
		}
		return (
			<div className="richTextBox" onBlur={this.handleBlur.bind(this)}>
				<div className="controlPanel">
					<ul className="menulist">
						<li className="menu menuFontStyle fontface">
							<a href="#" className="fontStrong" ref='fontStrong' onClick={(event) => {this.handleClick(event, 'bold')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontStrong')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontStrong')}}><FontInfoComponent text="加粗"/></a>
							<a href="#" className="fontItalic" ref='fontItalic' onClick={(event) => {this.handleClick(event, 'italic')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontItalic')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontItalic')}}><FontInfoComponent text="斜体"/></a>
							<a href="#" className="fontStrike" ref='fontStrike' onClick={(event) => {this.handleClick(event, 'strikeThrough')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontStrike')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontStrike')}}><FontInfoComponent text="删除线"/></a>
						</li>
						<li className="menu fontface">
							<a href="#" className="fontQuote" ref='fontQuote' onClick={this.handleClickQuote.bind(this)} onMouseOver={(event) => {this.handleMouseover(event, 'fontQuote')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontQuote')}}><FontInfoComponent text="引用"/></a>
						</li>
						<li className="menu fontface">
							<a href="#" className="code" ref="code" onClick={(e) => {this.handleClickCode(e)}} onMouseOver={(event) => {this.handleMouseover(event, 'code')}} onMouseOut={(event) => {this.handleMouseout(event, 'code')}}><FontInfoComponent text="代码块"/></a>
						</li>
						<li className="menu menuFontH" ref='menuFontH' onMouseOver={this.handleshow.bind(this, 'menuFontH')} onMouseOut={this.handlehidden.bind(this, 'menuFontH')}>
							<a href="#" className="fontH1" ref='fontH1' onClick={(event) => {this.handleClickH(event, '<h1>')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontH1')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontH1')}}>H1<FontInfoComponent text="标题1"/></a>
							<a href="#" className="fontH2" ref='fontH2' onClick={(event) => {this.handleClickH(event, '<h2>')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontH2')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontH2')}}>H2<FontInfoComponent text="标题2"/></a>
							<a href="#" className="fontH3" ref='fontH3' onClick={(event) => {this.handleClickH(event, '<h3>')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontH3')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontH3')}}>H3<FontInfoComponent text="标题3"/></a>
							<a href="#" className="fontH4" ref='fontH4' onClick={(event) => {this.handleClickH(event, '<h4>')}} onMouseOver={(event) => {this.handleMouseover(event, 'fontH4')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontH4')}}>H4<FontInfoComponent text="标题4"/></a>
						</li>
						<li className="menu menuLink fontface" ref="menuLink" onMouseOver={this.handleshow.bind(this, 'menuLink')} onMouseOut={this.handlehidden.bind(this, 'menuLink')}>
							<a href="#" className="linkFont" ref='linkFont' onClick={(event) => {this.handleLink(event, 'word')}} onMouseOver={(event) => {this.handleMouseover(event, 'linkFont')}} onMouseOut={(event) => {this.handleMouseout(event, 'linkFont')}}><FontInfoComponent text="文字链接"/></a>
							<a href="#" className="fontSplit" ref='fontSplit' onClick={(event) => {this.handleHr(event)}} onMouseOver={(event) => {this.handleMouseover(event, 'fontSplit')}} onMouseOut={(event) => {this.handleMouseout(event, 'fontSplit')}}><FontInfoComponent text="横线"/></a>
							<a href="#" className="linkPic" ref='linkPic' onClick={(event) => {this.handlePic(event, 'pic')}} onMouseOver={(event) => {this.handleMouseover(event, 'linkPic')}} onMouseOut={(event) => {this.handleMouseout(event, 'linkPic')}}><FontInfoComponent text="添加图片	"/></a>
						</li>
						
						<li className="menu fontface">
							<a href="#" className="changeShift" ref="changeShift" onClick={(e) => {this.handleShift(e)}} onMouseOver={(event) => {this.handleMouseover(event, 'changeShift')}} onMouseOut={(event) => {this.handleMouseout(event, 'changeShift')}}><FontInfoComponent text="Shift+Enter/Enter"/></a>
						</li>
						<Publishli publish={publish} handleClickPublish={this.handleClickPublish.bind(this)} handleCanclePublish={this.handleCanclePublish.bind(this)}/>
						
						<li className="menu fr fontface">
							<a href="#" className={"fullscreen"+(this.props.screen?' small':'')} ref='fullscreen' onClick={(e) => {this.handleFullScreen(e)}} onMouseOver={(event) => {this.handleMouseover(event, 'fullscreen')}} onMouseOut={(event) => {this.handleMouseout(event, 'fullscreen')}}><FontInfoComponent text="全屏"/></a>
						</li>
						<li className="menu fr fontface">
							<a href="#" className="saveWrite" ref='saveWrite' onClick={(event) => {this.handleClickSave(event)}}  onMouseOver={(event) => {this.handleMouseover(event, 'saveWrite')}} onMouseOut={(event) => {this.handleMouseout(event, 'saveWrite')}}><FontInfoComponent text="保存"/></a>
						</li>
					</ul>
				</div>
				<div className="controlWriteBox">
					<div className="controlWrite" id="controlWrite" ref="controlWrite" contentEditable="true" onFocus={this.handleFocus.bind(this)} onBlur={(event) => {this.copy=false;this.refs.controlWrite.removeEventListener('DOMSubtreeModified',this.changeSave);event.stopPropagation()}} onKeyDown={(e) => {handleShift(e)}} onPaste={(e) => {this.handlePaste(e)}} onCopy={(e) => {this.handleCopy(e)}} onCut={(e) => {this.handleCopy(e)}}></div>
				</div>
				<div ref="pasteWrite" contentEditable="true" style={{width: 1,height: 1, position:'absolute', left: -10000, top: 0,zIndex:-1, overflow:'hidden'}} onFocus={(e) => {this.pasteFocus(e)}}></div>
				{state.type ? <ModelComponent type={state.type} text={state.text} link={state.link} elm={state.elm} changeState={this.changeState.bind(this)} clickListener={this.clickListener}/> :''}
			</div>
		)
	}
}

// @props
// index: selected && articleSelected
// data: 文章等的信息
class WriteComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			fullscreen: false
		}
	}


	handleChange() {
		var writeTitle = this.refs.writeTitle;
		var content = writeTitle.value;
		var changeTitle = this.props.changeTitle;
		changeTitle(content);
	}

	handleKeyDown(e) {
		if(e.ctrlKey && (e.keyCode == 83)) {
			var ControlWriteComponent = this.refs.ControlWriteComponent;
			var save = ControlWriteComponent.handleClickSave.bind(ControlWriteComponent);
			save(e);
		}
	}

	fullscreen() {
		var fullscreen = this.state.fullscreen ? false : true;
		this.setState({
			fullscreen: fullscreen
		})
	}

	render() {

		var index = this.props.index, data = this.props.data;
		var value = '',save = '';
		var show = index[1] < 0 ? false : true;
		if(show) {
			if(data.length && data[index[0]].articles[index[1]]){
				var item = data[index[0]].articles[index[1]];
				value = item.name;
				save = item.save;
			}
		}
		
		return (
			<div className={'writeArea'+(this.state.fullscreen?' fullScreen':'')} style={show?{}:{display:'none'}}>
				<SavedComponent save={save}/>
				<div className="writeAreaBox" onKeyDown={this.handleKeyDown.bind(this)}>
					<form>
						<div className="writeTitleDiv">
							<input ref="writeTitle" className="writeTitle" type="text" name="writeTitle" onChange={this.handleChange.bind(this)} value={value}/>
						</div>
					</form>
					<ControlWriteComponent index={index} data={data} key="ControlWriteComponent" ref="ControlWriteComponent" changeContent={this.props.changeContent} changeSave={this.props.changeSave} changePublish={this.props.changePublish} fullscreen={this.fullscreen.bind(this)} screen={this.state.fullscreen}/>
				</div>
			</div>
		)
	}
}

export default WriteComponent;