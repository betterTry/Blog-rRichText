import React from 'react';
import ReactDOM from 'react-dom';

const $ = {
	ajax: require('reqwest')
}

class ArticleSetIconComponent extends React.Component {

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

	render() {
		return (
			<div className="articleSet">
				<div className="articleSetIcon fontface" onClick={this.handleClick.bind(this)}></div>
				<div className={'articleSetBox'+(this.state.click?'':' hide')}>
					<span className="triangle articleSetTriangle">
						<em></em>
					</span>
					<div className="articleSetTypeBox">
						<div className="articleSetType"><a>直接发布</a></div>
						<div className="articleSetType"><a>移动文章</a></div>
						<div className="articleSetType"><a onClick={this.props.handleClickRemove}>删除文章</a></div>
					</div>
				</div>
			</div>
		)
	}
}

class ArticlesComponent extends React.Component {

	handleClick() {
		if(this.props.selected) {
			return ;
		} else {
			this.props.articleSelected();
		}
	}

	render() {
		return (
			<div className={'articles'+(this.props.selected?' articlesSelected':'')} onClick={this.handleClick.bind(this)}>
				<div className="articleIcon">
				</div>
				<div className="articlesTitle">
					<span>{this.props.title}</span>
					<p className="articleDes"></p>
				</div>
				<ArticleSetIconComponent handleClickRemove={this.props.handleClickRemove}/>
			</div>
		)
	}
}

class AddNewArticleComponent extends React.Component {

	handleClick() {
		var workId = this.props.workId;
		$.ajax({
			url: '/write/create/article/' + workId,
			method: 'GET',
			success: function(result) {
				if(result.success) {
					this.props.addNewArticle(result.id);
				}
			}.bind(this)
		})
	}

	render() {
		return (
				<div className="addNewArticle" onClick={this.handleClick.bind(this)}>
					<a>
						<span className="addNewArticleSign fontface"></span>
						<span>新建文章</span>
					</a>
				</div>
		)
	}
}

class MidAreaComponent extends React.Component {
	
	constructor() {
		super();
	}

	handleClickRemove(index) {
		var props = this.props;
		$.ajax({
			url: '/write/delete/article/' + props.data[index]._id + '?workId=' + props.workId,
			method: 'DELETE',
			success: function(result) {
				if(result.success) {
					props.changeContent();
					props.removeState();
				}
			}
		})
	}

	render() {
		var titles = this.props.data,
			articles = [];
		if(titles)
			titles.forEach(function(item, index){
				var selected = false;
				if (this.props.selected === index) {
					selected = true;
				}
				articles.push(<ArticlesComponent title={item.name} key={index} selected={selected} articleSelected={this.props.articleSelected(index)} handleClickRemove={this.handleClickRemove.bind(this, index)}/>)
			}.bind(this));

		return (
			<div className="midWrap">
				<AddNewArticleComponent workId={this.props.workId} addNewArticle={this.props.addNewArticle}/>
				{articles}
			</div>
		)
	}
}

export default MidAreaComponent;