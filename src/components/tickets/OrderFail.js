import React from 'react';
import { appContext } from './TicketApp';


export default class OrderSuccess extends React.Component {
	constructor(props) {
		super(props);

	}


	render() {

		
		return(
			<div className="shop-layout">
				<div className="order-result">
					<h1>Произошла ошибка во время выполнения оплаты, попробуйте повторить покупку билета</h1>
				</div>
				
				
				
			</div>
		)
	}
}


























