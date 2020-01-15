import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import UserLayout from './UserLayout';

@observer
export default class SuccessInvoice extends React.Component {
	constructor(props) {
		super(props);
	}



	render() {
		
		return (
			<div className="successInvoice" id="success_invoice">
			<UserLayout selected="success" linksid={this.props.linksid}>
				<h2>Успешное пополнение баланса.</h2>
			</UserLayout>
			</div>
		);
	}
}