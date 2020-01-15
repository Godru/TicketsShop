import React from 'react';
import { observer } from 'mobx-react';
import { appContext } from './TicketApp';
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
			renderEmailError: false,
            ruleHint: "none",
			submitHint: false
		}
	}

	emailChange = e => {
		const value = e.currentTarget.value;
		this.setState({email: value, renderEmailError: false}, () => {
			this.checkEnabled();
			appContext.appState.order.email = this.state.email;
		});
		
	}
	componentWillMount(){
        if(appContext.appState.order.rule.id === 23){
            this.setState({ruleHint: "block"});
        }else{
            this.setState({ruleHint: "none"});
        }
	}
	emailConfirmChange = e => {
		const value = e.currentTarget.value;
		this.setState({emailConfirm: value, renderEmailError: false}, () => {
			this.checkEnabled();
			appContext.appState.order.email = this.state.email;
		});
		
	}

	checkEnabled = () => {
		if (this.state.email != "" && this.state.emailConfirm != "" && appContext.appState.order.count > 0 && appContext.appState.order.rule.text != "") {
			this.setState({submitEnabled: true});
		} else {
			this.setState({submitEnabled: false});
		}
	}

	submitTicket = () => {
		if(!this.state.submitHint) {
            if (this.state.email == this.state.emailConfirm) {
                this.setState({submitHint: true})
                appContext.appState.requestPlaceAPI(() => {
                })

            } else {
                this.setState({renderEmailError: true});
            }
        }
	}

	goBack = () => {
		// window.location.href = "#/";
		if (this.props.goBack ) {this.props.goBack();}
	}

	render() {
		const { rule, date, count, discount} = appContext.appState.order;
		let { price } = appContext.appState.order;
		price = price*count-price*count*discount/100;
		const ruleDetails = _.find(appContext.appState.rules, function(o) { return o.name == rule.text; });
		console.log(appContext.appState.order);
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
							<th>Cкидка</th>
						</tr>
						<tr>
							<td>{rule.text}</td>
							<td>{date.toLocaleDateString("ru-Ru")}</td>
							<td>{count}</td>
							<td>{price} руб</td>
							<td>{discount}%</td>
						</tr>
					</table>
                    <p style={{display: this.state.ruleHint}}>По данному билету может пройти до 4х человек. Обращайтесь к сотрудникам канатной дороги</p>
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
						<h1>{price} руб</h1>
					</div>
					<button disabled={!this.state.submitEnabled} className={"purchase-button " + (this.state.submitEnabled ? "" : " disbled")} onClick={this.submitTicket}>
						Оплатить
					</button>
					{this.state.submitHint ? <p>Пожалуйста подождите, генерируется заказ</p> : <div/>}
					<p>Приобретая билет, Вы подтверждаете, что ознакомлены с правилами поведения на канатной дороге</p>
					<p>В случае возникновения технических проблем с получением билета, пожалуйста, обращайтесь на почту info@srkvg.ru</p>
				</div>
				
			</div>
		)
	}
}