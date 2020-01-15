import React from 'react';

export default class Counter extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			value: 0,
			initialized: false,
		}
	}

	componentDidMount() {
		this.setState({value: this.props.initValue});
	}

	componentWillReceiveProps(nextProps) {
		if(!this.state.initialized) {
			this.setState({value: nextProps.initValue, initialized: true});
		}
	}

	onPlus = () => {

		this.setState({value: this.state.value + 1}, () => {
			this.props.onChange(this.state.value);
		});
	}

	onMinus = () => {
		if (this.state.value == 1) return;
		this.setState({value: this.state.value - 1}, () => {
			this.props.onChange(this.state.value);
		});
	}

	render(){

		return(
			<div className="counter">
				<div className="minus" onClick={this.onMinus}>-</div>
				<div className="counter-value">{this.state.value}</div>
				<div className="plus" onClick={this.onPlus}>+</div>
			</div>
		)
	}
}