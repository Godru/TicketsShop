import React from 'react';


export default class SelectField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem: {
				index: 0,
				text: "",
			},
			options: [],
			opened: false
		}
	}


	componentDidMount() {
		this.setState({options: this.props.options, selectedItem: this.props.options[0]});
	    document.addEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps(nextProps){
        this.setState({options: nextProps.options});
	}
	componentWillUnmount() {
	    document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef = (node) => {
		this.wrapperRef = node;
	}

	handleClickOutside = (event) => {
	    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	    	this.setState({opened: false});
	    }
	}


	onSelect = (item) => {
		this.setState({selectedItem: item}, () => {
			this.toggleBox();
			if(this.props.selectOption) this.props.selectOption(this.state.selectedItem);
		});
	}

	toggleBox = () => {
		this.setState({opened: !this.state.opened});
	}

	render() {

		return(
			<div ref={this.setWrapperRef} className="select-container">
				<div className="select-box" onClick={this.toggleBox}>
					<span className="label">{this.state.selectedItem.text}</span>
					<span className="arrow"></span>
				</div>
				<div className="select-options">
					<SelectOptions opened={this.state.opened} options={this.state.options} onSelect={this.onSelect} />
				</div>
			</div>
			
		)
	}
}

class SelectOptions extends React.Component {
	constructor(props) {
		super(props);

	}

	selectOption = (option) => {
		console.log("in select options", option);
		this.props.onSelect(option);
	}

	render() {
		if (this.props.opened) {
			return(
				<div className="options-list">
					<ul>
						{
							this.props.options.map((item, i) => {
								return(<li key={i} onClick={() => {this.selectOption(this.props.options[i])}} >{this.props.options[i].text}</li>);
							})

						}
					</ul>
				</div>
			)
		} else {
			return null;
		}
		
	}
}







