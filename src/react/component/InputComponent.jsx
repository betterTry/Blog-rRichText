import React from 'react';

class InputComponent extends React.Component {

	handleChange(e) {
		var changeWorkInput = this.refs.changeWorkInput;
		this.setState({
			value: changeWorkInput.value
		})
	}

	componentWillReceiveProps(nextProps) {
		const {open, value} = nextProps;
		this.setState({
			value: value
		})
		if(open) {
			var changeWorkInput = this.refs.changeWorkInput;
			setTimeout(() => {
				changeWorkInput.select();
			}, 0)
		}
	}

	render() {

		var state = this.state;
		if(state) {
			var value = state.value
		}
		return (
			<div style={{marginTop:20,padding:20}}>
				<label className="changeWorkLabel" htmlFor="changeWork">更改文集名</label>
				<input className="changeWorkInput" name="changeWork" ref="changeWorkInput" value={value} onChange={this.handleChange.bind(this)}/>
				<div style={{marginTop: 20}}>
					<button className="changeWorkButton" onClick={this.props.changeWorkClose}>取消</button>
					<button className="changeWorkButton" onClick={(e) => {this.props.renameWork(value)}}>确认</button>
				</div>
			</div>
		)
	}
}

export default InputComponent;
