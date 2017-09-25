import React from 'react';
import ReactDOM from 'react-dom';

import MovedivComponent from './Movediv.jsx';
import MidAreaComponent from './Article.jsx';
import WriteComponent from './Write.jsx';
import InputComponent from './component/InputComponent.jsx';

import {util} from '../libs';
const $ = {
	ajax: require('reqwest')
}

class LoadingComponent extends React.Component {
	constructor(){
		super();
		this.state = {
			hidden: false,
			display: true
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		var state = this.state;
		if(state.hidden == true && state.display == false){
			return false
		}
		return true;
	}
	componentDidMount() {
		setTimeout(function(){
			this.setState({
				hidden: true
			})
		}.bind(this), 1200)
		setTimeout(function(){
			this.setState({
				display: false
			})
		}.bind(this), 1500)
	}

	render() {

		var state = this.state;
		return(
			<div className={"loadingBar"+(state.hidden?' hidden':'')} style={!this.state.display ? {display:'none'} :{}}>
				<ul className="loadingUl">
					<li><span className="loadingIcon"></span></li>
					<li><span className="loadingIcon"></span></li>
					<li><span className="loadingIcon"></span></li>
				</ul>
			</div>
		)
	}
}

class PublishedComponent extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		if(this.props.show == nextProps.show) {
			return false;
		}
		return true;
	}

	handleClick(e) {
		e.stopPropagation();
		this.props.closePublish(false);
	}
	render() {
		var styleObj;
		var props = this.props;
		var show = props.show;
		if(show) {
			styleObj = {display:'block',opacity: 1}
		} else {
			styleObj = {opacity:0}
			setTimeout(function() {
				this.refs.published.style.cssText = 'display:none;opacity:1';
			}.bind(this), 600)
		}


		var starPath = "pic/moveDiv/star1_30x30.png";
		var options = [
			{
				src: 'pic/moveDiv/moon_150x150.png',
				range: {left: 10, top: 10},
				pos: {left: -12, top: 50}
			},{
				src: 'pic/moveDiv/flight_200x140.png',
				range: {left: 20},
				size: {width: 35, height: 25},
				pos: {top: 100, right: 100}
			},{
				src: "pic/moveDiv/flyStar_150x100.png",
				range: {left: 20, top: 20},
				pos: {left: 100, top: 100}
			},{
				src: "pic/moveDiv/land.png",
				range: {left: 10, top: 10},
				size: {width: 400, height: 200},
				pos: {bottom: -16,right: -16}
			},{
				src: "pic/moveDiv/rocket_70x160.png",
				range: {top: 20},
				size: {width: 28, height: 64},
				pos: {top: 10, left: 250}
			},{
				src:[starPath, starPath, starPath, starPath, starPath, starPath],
				size: [{width: 10, height: 10}, {width: 10, height: 10},{width: 15,height: 15},{width: 15, height: 15},{width: 8, height: 8},{width: 8, height: 8}],
				pos: [{left: 100, top: 10},{top: 15, right: 20},{top: 5,right: 10},{top: 20, left: -4},{top: 175, left: 20},{top: 10, left: 5}],
				range: {top: 5,left: 5}
			}
		]
		var _styleObj = { width: 560,height: 280, margin: '0 auto', backgroundColor:'#5b3d85', position:'relative'};
		return(
			<div className="published" style={styleObj} ref="published">
				<div className="publishedBox">
					<h1 className="publishState"><span className="rightIcon"></span><span>已发布</span></h1>
					<div className="blockItem">
						<h1><a href={'/article/'+props.id}>{props.title}</a></h1>
					</div>
				</div>
				<div className="publishedClose" onClick={(e) => {this.handleClick(e)}}>
					<span className="closeIcon"></span>
				</div>
				<div>
					<MovedivComponent styleObj={_styleObj} data={options}/>
				</div>
			</div>
		)
	}
}


class ChangeWorkComponent extends React.Component {

	shouldComponentUpdate(nextProps) {
		if(nextProps.open == this.props.open)
			return false;
		return true;
	}

	handleKeyDown(e) {
		if(e.keyCode == 13) {
			this.renameWork();
		} else if(e.keyCode == 27) {
			this.props.changeWorkClose();
		}
	}
	handleClick(e) {
		var target = e.target;
		var changeWorkBox = this.refs.changeWorkBox;
		if(target == changeWorkBox) {
			this.props.changeWorkClose();
		}
	}

	renameWork() {
		var changeWorkInput = this.refs.InputComponent.refs.changeWorkInput;
		this.props.renameWork(changeWorkInput.value);
	}

	render() {
		var open = this.props.open;
		var value = this.props.default;
		var backgroundColor = 'transparent';
		if(open) {
			var display = 'block';
			backgroundColor = 'rgba(255, 255, 255, 1)'
		} else {
			var display = 'none';
			value = '';
		}
		var styleObj = {
			display: display,
			backgroundColor: backgroundColor
		}
		return(
			<div className="changeWorkBox" style={styleObj} ref="changeWorkBox" onKeyDown={this.handleKeyDown.bind(this)} onClick={this.handleClick.bind(this)}>
				<div className="changeWork">
					<InputComponent value={value} open={open} changeWorkClose={this.props.changeWorkClose} renameWork={this.props.renameWork} ref="InputComponent"/>
				</div>
			</div>
		)
	}
}

class AddNewWorkComponent extends React.Component {

	constructor(props) {
		super();
		this.state = {
			value: '',
			change: false,
			styleObj: {
				height: '50px'
			},
			carry: false
		}
	}

	handleChange(e) {
		var value, change;
		var state = util.deepCopy(this.state);
		if(this.state.change) {
			state.value = e.target.value ? e.target.value : this.props.default,
			state.change = false
		} else {
			state.value = e.target.value.replace(this.props.default,'');
			state.change = true
		}

		this.setState(state)
		e.preventDefault();
	}

	handleClick(e) {
		var state = util.deepCopy(this.state);
		state.styleObj = state.carry ? {height:'50px'} : {height:'142px'};
		state.carry = !state.carry;
		this.setState(state);
		e.preventDefault();
	}

	handleNewWork() {
		var name = this.state.value;
		var props = this.props;
		if(name == props.default) {
			name = '新文集';
		}
		$.ajax({
			url: '/write/create/work?name=' + name,
			method: 'GET',
			success: function(result) {
				if(result.success) {
					props.addNewWork(name, result.id);
					this.setState({
						styleObj: {
							height: '50px'
						}
					})
				}
			}.bind(this)
		})
	}


	render() {
		return (
			<div className="addNewWork" style={this.state.styleObj}>
				<a onClick={this.handleClick.bind(this)}>
					<span className="plusSign">+</span>
					<span>新建文集</span>
				</a>
				<div className>
					<input type="text" placeholder="文集名.." className="addNewWorkInput" onChange={this.handleChange.bind(this)} value={this.state.value} />
					<div className="buttonGroup">
						<button className="buttonItem buttonSubmit" onClick={this.handleNewWork.bind(this)}>提交</button>
						<button className="buttonItem buttonCancel" onClick={this.handleClick.bind(this)}>取消</button>
					</div>
				</div>
			</div>
		)
	}
}

class SetButtonComponent extends React.Component {
	constructor() {
		super();
		this.state = {
			click: false
		}
	}

	handleClick(e) {

		var windowClick = function() {
			this.setState({
				click: false
			})
			window.removeEventListener('click', windowClick);

		}.bind(this);

		var click = this.state.click ? false : (function() {
			window.addEventListener('click', windowClick)

			return true;
		}());
		this.setState({
			click: click
		});
		e.stopPropagation();
		e.preventDefault();
	}

	removeWork() {
		var props = this.props;
		var id = props.workId;
		$.ajax({
			url: '/write/delete/work?workId=' + id,
			method: 'DELETE',
			success: function(result) {
				if(result.success) {
					props.removeWork();
				}
			}
		})
	}


	render() {
		return (
			<div className="setButton">
				<div className="setButtonIcon fontface" onClick={this.handleClick.bind(this)}></div>
				<div className={'setButtonBox'+(this.state.click?'':' hide')}>
					<span className="triangle setButtonTriangle">
						<em></em>
					</span>
					<div className="setButtonTypeBox">
						<div className="setButtonType">
							<a onClick={this.props.changeWorkOpen}>
								修改文集名
							</a>
						</div>
						<div className="setButtonType">
							<a onClick={this.removeWork.bind(this)}>
								删除文集
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
}


class WorkTypeComponent extends React.Component {

	constructor() {
		super();
		this.keydown = false;
		this.state = {
			position: 'relative'
		};
		this.mousemove = this.mousemove.bind(this)
		this.mouseleave = this.handleMouseUp.bind(this)
	}

	handleClick() {
		if(this.props.selected) {
			return ;
		} else {
			this.props.workSelected()
		}

	}

	handleMouseDown(e) {
		this.keydown = true;
		var WorkType = this.refs.WorkType;
		var leftWrap = document.getElementById('leftWrap');
		var position = util.position(WorkType, leftWrap);
		var left = e.clientX, top = e.clientY;
		this.position = {
			left: left,
			_left: position.left,
			top: top,
			_top: position.top
		}
		leftWrap.addEventListener('mousemove', this.mousemove)
		leftWrap.addEventListener('mouseleave', this.mouseleave)
		e.preventDefault();
	}

	handleMouseOut(e) {
		e.preventDefault()
	}

	handleMouseUp(e) {
		e.preventDefault();
		var leftWrap = document.getElementById('leftWrap');
		this.keydown = false;
		this.position = {};
		leftWrap.removeEventListener('mousemove', this.mousemove);
		leftWrap.removeEventListener('mouseleave', this.mouseleave);
		this.setState({
			zIndex: '',
			position: 'relative',
			left: '',
			top: ''
		});

	}

	mousemove(e) {
		var _position = this.position;
		var left = e.clientX - _position.left, top = e.clientY - (_position.top - _position._top), position = 'absolute';
		var state = {
			left: left,
			top: top,
			position: position,
			zIndex: 102
		}
		this.setState(state);
		e.preventDefault();
	}

	render() {
		var styleObj = this.state;
		return (
			<div style={styleObj} className={'WorkType' + (this.props.selected ? ' WorkTypeSelected' : '')} onClick={this.handleClick.bind(this)} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} ref="WorkType" >
				<a className="WorkTypeLink">{this.props.Type}</a>
				<SetButtonComponent workId={this.props.workId} removeWork={this.props.removeWork} changeWorkOpen={this.props.changeWorkOpen}/>
			</div>
		)
	}
}

class LeftAreaComponent extends React.Component {

	constructor() {
		super();
		this.state = {
			open: false
		}
	}

	changeWorkOpen() {
		this.setState({
			open: true
		})
	}
	changeWorkClose() {
		this.setState({
			open: false
		})
	}
	renameWork(name) {
		var props = this.props;
		var id = props.workId;
		var _name = props.data[props.selected];

		if(name !== _name) { // 只有名字更改了，才发起请求;
			$.ajax({
				url: '/write/rework',
				method: 'POST',
				data: {
					id: id,
					name: name
				},
				success: function(result) {
					if(result.success) {
						this.props.renameWork(name);
						this.changeWorkClose();
					}
				}.bind(this)
			})
		}
	}

	render() {
		var works = [],
			Types = this.props.data;
		if(Types) {
			Types.forEach(function(item, index) {
				var selected = false;
				if (this.props.selected === index) {
					selected = true;

				}
				works.push(<WorkTypeComponent Type={item} key={'work'+index} ref={'workType' + index} selected={selected} workSelected={this.props.workSelected(index)} workId={this.props.workId} removeWork={this.props.removeWork} changeWorkOpen={this.changeWorkOpen.bind(this)} index={index}/>)
			}.bind(this));
		}
		return (
			<div id="leftWrap" ref="leftWrap">
				<div className="backToIndex" ref="backToIndex">
					<a className="backToIndexLink" href="/">
						<span>回首页</span>
					</a>
				</div>
				<AddNewWorkComponent addNewWork={this.props.addNewWork}/>
				{works}
				<ChangeWorkComponent open={this.state.open} default={Types[this.props.selected]} changeWorkClose={this.changeWorkClose.bind(this)} renameWork={this.renameWork.bind(this)} />
			</div>
		)
	}
}

class AppComponent extends React.Component {
	constructor(props) {
		super();
		this.state = {
			data: [],
			selected: 0,
			articleSelected: 0,
			published: false,
			loading: true
		};
	}

	componentDidMount() {
		$.ajax({
			url: '/write/init',
			method: 'GET',
			success: function({success, data, article}) {
				if (success) {
					if (data.length) {
						document.getElementById('controlWrite').innerHTML = article.content;
						data.forEach((item, index) => {
							var articles = data[index].articles;
							articles.forEach((item) => {
								item.save = true;
							});
						});
						this.content = [[data[0].articles[0].content]];
					} else {
						this.content = '';
					}
					this.setState({
						data: data,
						selected: 0,
						articleSelected: 0,
						loading: false
					})
				}
			}.bind(this)
		})
	}

	workSelected(index) {
		return function(){
			var state = util.deepCopy(this.state);
			state.selected = index;

			var length = state.data[index].articles.length;
			if(length) {
				length = 0;
			} else {
				length = -1;
			}
			state.articleSelected = length;
			this.setState(state);

			this.getArticleContent(state, index, length);
		}.bind(this)
	}

	articleSelected(index) {
		return function(){
			var state = util.deepCopy(this.state);
			state.articleSelected = index;
			this.setState(state);

			var selected = state.selected;
			var articleSelected = state.articleSelected;

			this.getArticleContent(state, selected, index);

		}.bind(this)
	}

	getArticleContent(state, selected, index) {
		if(index > -1) {
			if(!this.content[selected] || !this.content[selected][index]) {
				$.ajax({
					url: '/write/article/' + state.data[selected].articles[index]._id,
					method: 'GET',
					success: function(result) {
						if(result.success) {
							var content = result.data.content;
							if(!this.content[selected]){
								this.content[selected] = [];
							}
							this.content[selected][index] = content;
							document.getElementById('controlWrite').innerHTML = content;
						}
					}.bind(this)
				})
			} else {
				document.getElementById('controlWrite').innerHTML = this.content[selected][index];
			}
		}
	}

	changeTitle(content) {
		var state = util.deepCopy(this.state);
		var i = state.selected, j = state.articleSelected;

		state.data[i].articles[j].name = content;
		state.data[i].articles[j].save = false;
		this.setState(state);
	}

	addNewArticle(id) {
		var state = util.deepCopy(this.state);
		var data = state.data[state.selected];
		var article = {
			name: '无标题文章',
			_id: id,
			work: data._id
		}
		data.articles.unshift(article);
		this.content[state.selected].unshift('<p><br/></p>');
		state.articleSelected = 0;
		var controlWrite = document.getElementById('controlWrite');
		controlWrite.innerHTML = '<p><br/></p>';

		this.setState(state);
		controlWrite.focus();
	}

	changeContent(content) {
		var i = this.state.selected, j = this.state.articleSelected;
		if(arguments.length){
			this.content[i][j] = content;
		} else {
			this.content[i].splice(j, 1);
		}
	}

	removeState() {
		var i = this.state.selected, j = this.state.articleSelected;
		var state = util.deepCopy(this.state);
		var articles = (state.data)[i].articles;
		var length = articles.length;
		if( j == length - 1) {
			state.articleSelected = j - 1;
		}
		articles.splice(j, 1);
		this.setState(state);
		this.getArticleContent(state, i, j - 1);
	}

	addNewWork(name, id) {
		var data = this.state.data;
		var work = {
			name: name,
			_id: id,
			articles: []
		}
		data.unshift(work);
		this.setState({
			data: data,
			articleSelected: -1,
			selected: 0
		});
	}

	removeWork() {
		var state = this.state;
		var data = state.data, i = state.selected;
		data.splice(i, 1);
		this.content.splice(i, 1);
		var selected = i == data.length ? (i - 1) : i;
		if(data[selected].articles.length) {
			var articleSelected = 0;
		} else {
			var articleSelected = -1;
		}
		this.setState({
			data: data,
			selected: selected,
			articleSelected: articleSelected
		})
	}

	changeSave(value) {
		var value = (value !== undefined) ? value : true;
		var state = util.deepCopy(this.state);
		var i = state.selected,
			j = state.articleSelected;
		state.data[i].articles[j].save = value;
		this.setState(state);
	}
	closePublish(value) {
		var value = value || false;
		this.setState({
			published: value
		})
	}
	changePublish(value) {
		var state = util.deepCopy(this.state);
		var i = state.selected,
			j = state.articleSelected;
		state.data[i].articles[j].publish = value;
		state.published = value;
		this.setState(state);
	}
	renameWork(name) {
		var state = util.deepCopy(this.state);
		state.data[state.selected].name = name;
		this.setState(state);
	}


	render() {
		var works = [], articles = [];
		var data = this.state.data;
		data.forEach(function(item, index) {
			works.push(item.name);
		});
		var state = this.state;
		var selected = state.selected, articleSelected = state.articleSelected;
		articles = data[selected] ? data[selected].articles : '';
		var workId = data.length ? data[selected]._id : '';

		var published = state.published;
		var id = published ? articles[articleSelected]._id : '';
		var title = published ? articles[articleSelected].name : '';
		return (
			<div className="root">
				<LeftAreaComponent data={works} key='LeftArea'
						selected={selected} workId={workId}
						workSelected={this.workSelected.bind(this)}
						addNewWork={this.addNewWork.bind(this)} removeWork={this.removeWork.bind(this)} renameWork={this.renameWork.bind(this)}/>
				<MidAreaComponent data={articles} key='MidArea'
						workId={workId} selected={articleSelected}
						articleSelected={this.articleSelected.bind(this)}
						addNewArticle={this.addNewArticle.bind(this)} changeContent={this.changeContent.bind(this)} removeState={this.removeState.bind(this)}/>
				<WriteComponent data={data} key='Write'
						index={[selected, articleSelected]}
						changeTitle={this.changeTitle.bind(this)} changeContent={this.changeContent.bind(this)} changeSave={this.changeSave.bind(this)} changePublish={this.changePublish.bind(this)}/>
				<PublishedComponent show={state.published}
					 closePublish={this.closePublish.bind(this)} id={id} title={title}/>
				<LoadingComponent props={state.loading}/>
			</div>
		)
	}
}
export default AppComponent;
