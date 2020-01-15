import React from 'react';
import { observer } from 'mobx-react';
import { appContext } from './TicketApp';
import { DatePicker } from 'lib/date_picker';
import SelectField from 'lib/select-field';
import Counter from 'lib/counter';
import Checkout from './Checkout';


@observer
export default class ShopPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: "shop",
			date: new Date(),
			showPromoError: false,
            showPromoSuccess: false,
			count: 1,
			promo: "",
			discount: 0,
			ruleHint: "none",
			rule: {
				index: 0,
				text: ""
			},
			rules: []
		}
	}

	changeCount = (count) => {
		this.setState({count: count});
	}

	setDate = (date) => {
		this.setState({date: date});
        appContext.appState.requestServiceRulesByDate(date, data => {
            if (data.length <= 0) return;
            let rules = this.parseRules(data);
            this.setState({rules: rules, rule: rules[this.state.rule.index],
                showPromoError: false,showPromoSuccess: false,
                discount: 0,promo: ""});
        })
	}

	setRule = (rule) => {
		if(rule.id === 23){
            this.setState({rule: rule,ruleHint: "block"});
		}else{
            this.setState({rule: rule,ruleHint: "none"});
		}
	}

	submitTicket = () => {
		appContext.appState.order = {
			promo: this.state.promo,
			discount: this.state.discount,
            date: this.state.date,
            count: this.state.count,
            rule: this.state.rule,
            price: this.state.rule.price,
            id: this.state.rule.id
		}
		// appContext.appState.openCheckout();
		this.setState({page: "checkout"});
	}

	setShop = () => {
		this.setState({page: "shop"});
	}

	componentDidMount() {
		appContext.appState.requestServiceRulesByDate(this.state.date,(data) => {
			console.log(data);
			if (data.length <= 0) return;
			let rules = this.parseRules(data);
			this.setState({rules: rules, rule: rules[0]});
		})
	} 

	parseRules = (data) => {
		let rules = [];
		data.map((item, i) => {
			rules.push({
				id: item.id,
                price: item.price,
				index: i,
				text: item.name,
			})
		})
		return rules;
	}
    promoChange = e =>{
        let value = e.currentTarget.value;
        if(value.length > 15){
        	value = value.slice(0,15);
		}
        this.setState({promo: value,showPromoError: false, showPromoSuccess: false});
	}
	promoCheck = () =>{
        appContext.appState.requestCheckPromo(this.state.promo,this.state.date ,data => {
            //if (data.length <= 0) return;
            if (data['is_active'] === "true"){
                this.setState({discount: data['discount'],showPromoSuccess: true, showPromoError: false, promoDate: this.state.date});
            }
            else{
				this.setState({showPromoError: true,showPromoSuccess: false});
            }
        })
	}
	render() {
		//console.log(this.state.rules);
		const costs = appContext.appState.costs;
		const { rules } = this.state;
		let note ;
        if (this.state.showPromoError) {
            note = (<p className="promo-false">Промокод не работает или действителен в другой день</p>)
        }
        if (this.state.showPromoSuccess) {
            note = (<p className="promo-true">Промокод применен</p>)
        }
        /*{this.state.promo} работает {this.state.date.getDate()}.
            {this.state.date.getMonth()}.{this.state.date.getFullYear()}*/
		const shop = (
			<div>
			<h1>ПОКУПКА БИЛЕТА</h1>
				<div className="ticket-settings">

					<div className="ticket-date">
						<h2>Выберите дату поездки</h2>
						<DatePicker handleChange={this.setDate}/>
					</div>
					<div className="ticket-rule">
						<h2>Выберите тариф</h2>
						{
							rules.length == 0 ? (<div></div>) : (<SelectField options={rules} selectOption={this.setRule}/>)
						}
						<div className="tariff-hint" style={{display: this.state.ruleHint}}>
							<p>По данному билету может пройти до 4х человек. Обращайтесь к сотрудникам канатной дороги</p>
						</div>
					</div>
					<div className="ticket-count">
						<h2>Выберите количество</h2>
						<Counter initValue={1} onChange={this.changeCount}/>
						<h4>(не более 50 билетов за заказ)</h4>
					</div>
					<div className="costs-label">
						<p>Цена за проезд в <span>одну сторону</span></p>
						<ul>
							<li>понедельник - 100 руб</li>
							<li>вторник - 150 руб</li>
							<li>среда-пятница - 250 руб</li>
							<li>выходные и праздничные дни - 400 руб</li>
						</ul>
						<p>Цена за проезд в <span>туда-обратно</span></p>
						<ul>
							<li>понедельник - 150 руб</li>
							<li>вторник - 250 руб</li>
							<li>среда-пятница - 450 руб</li>
							<li>выходные и праздничные дни - 600 руб</li>
						</ul>
					</div>
				</div>
				<div className="price-section">
					<div className="ticket-cost">
						<h2>Стоимость покупки</h2>
						<p>{this.state.rule.price*this.state.count-this.state.rule.price*this.state.count*this.state.discount/100} Руб</p>
					</div>
					<div className="promo-section">
						<h2>Введите промокод</h2>
						<input value={this.state.promo} type="text" name="promo" onChange={this.promoChange}/>
                        {note}
						<button className="check-button" onClick={this.promoCheck}>
							Проверить
						</button>

					</div>
				</div>
				<div className="submit-section">

					<button className="purchase-button" onClick={this.submitTicket}>
						Купить
					</button>
                    <p>Приобретая билет, Вы подтверждаете, что ознакомлены с правилами поведения на канатной дороге</p>
					<p>В случае возникновения технических проблем с получением билета, пожалуйста, обращайтесь на почту info@srkvg.ru</p>
				</div>
            </div>
		)

		const checkout = (
			<Checkout goBack={this.setShop} />
		)
		return(
			<div className="shop-layout">
				{this.state.page == "shop" ? shop : (<div></div>)}
				{this.state.page == "checkout" ? checkout : (<div></div>)}
			</div>
		)
	}
}


























