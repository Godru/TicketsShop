import React from 'react';
import { observer } from 'mobx-react';
import { appContext } from './SessionTicketsApp';
import { DatePicker } from 'lib/date_picker';
import SelectField from 'lib/select-field';
import Counter from 'lib/counter';
import _ from 'lodash';

@observer
export default class Checkout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			submitEnabled: false,
			email: "",
			emailConfirm: "",
			renderEmailError: false
		}
	}

	emailChange = e => {
		const value = e.currentTarget.value;
		this.setState({email: value, renderEmailError: false}, () => {
			this.checkEnabled();
			appContext.appState.order.email = this.state.email;
		});
		
	}

	emailConfirmChange = e => {
		const value = e.currentTarget.value;
		this.setState({emailConfirm: value, renderEmailError: false}, () => {
			this.checkEnabled();
			appContext.appState.order.email = this.state.email;
		});
		
	}

	checkEnabled = () => {
		if (this.state.email != "" && this.state.emailConfirm != "" && appContext.appState.order.count > 0 && appContext.appState.order.session.id) {
			this.setState({submitEnabled: true});
		} else {
			this.setState({submitEnabled: false});
		}
	}

	submitTicket = () => {
		if(this.state.email == this.state.emailConfirm) {
			appContext.appState.requestPlaceAPI(() => {})
			
		} else {
			this.setState({renderEmailError: true});
		}
	}

	goBack = () => {
		// window.location.href = "#/";
		if (this.props.goBack ) {this.props.goBack();}
	}

	render() {

		const { session, date, count } = appContext.appState.order;
		const timeMatch = session.name.match(/^(\d+:\d+):\d+-(\d+:\d+):\d+/);
		const time = `${timeMatch[1]}-${timeMatch[2]}`;
		const ruleDetails = _.find(appContext.appState.rules, function(o) { return o.name == rule.text; });
		let weekdayPrice = 0;
		let weekendPrice = 0;
		if (ruleDetails) {
			weekdayPrice = (count || 0)*ruleDetails.weekday_cost.toFixed(2);
			weekendPrice = (count || 0)*ruleDetails.weekend_cost.toFixed(2);
		}

		let note = null;
		if (this.state.renderEmailError) {
			note = (<p className="email-note">Адреса электронной почты не совпадают.</p>)
		}

		return(

			<div className="shop-layout">
				<h1>ПОКУПКА БИЛЕТА</h1>
				<button className="back-button" onClick={this.goBack}>Назад</button>
				
				<div className="order-positions">			
					<table>
						<tr>
							<th>Билет</th>
							<th>Дата</th>
							<th>Количество</th>
							<th>Цена</th>
						</tr>
						<tr>
							<td>{"Сеанс " + time}</td>
							<td>{date.toLocaleDateString("ru-Ru")}</td>
							<td>{count}</td>
							<td>{session.price * count} руб.</td>
						</tr>
					</table>
				</div>
				<div className="form">
					<label htmlFor="email">Введите адрес почты для получения билетов*</label>
					<input type="text" name="email" onChange={this.emailChange}/>
					<label htmlFor="email-confirm">Повторите адрес электронной почты*</label>
					<input type="text" name="email-confirm" onChange={this.emailConfirmChange}/>
					{note}
				</div>
				<div className="submit-section">
					<div className="total-price">
						<h1>{session.price * count} руб.</h1>
					</div>
					<button disabled={!this.state.submitEnabled} className={"purchase-button " + (this.state.submitEnabled ? "" : " disbled")} onClick={this.submitTicket}>
						Оплатить
					</button>
				</div>
				
			</div>
		)
	}
}