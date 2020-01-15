import React from 'react';
import { observer } from 'mobx-react';
import { appContext } from './SessionTicketsApp';
import { DatePicker } from 'lib/date_picker';
import SelectField from 'lib/select-field';
import Counter from 'lib/counter';
import Checkout from './SessionsCheckout';


@observer
export default class ShopPage extends React.Component {
	constructor(props) {
		super(props);

		
		this.state = {
			page: "shop",
			date: new Date(),
			count: 1,
			sessions: [],
			selectedSession: {}
		}
	}

	changeCount = (count) => {
		this.setState({count: count});
	}

	setDate = (date) => {
		this.setState({date: date, selectedSession: {}}, () => {
			this.updateSessions()
		});
	}

	updateSessions = () => {
		appContext.appState.requestSessionsByDate(this.state.date, (sessions) => {
			this.setState({sessions: sessions || []});
		})
	}

	submitTicket = () => {
		if (!this.checkEnabled()) return;
		appContext.appState.order = {
			date: this.state.date,
			count: this.state.count,
			session: this.state.selectedSession
		}
		// appContext.appState.openCheckout();
		this.setState({page: "checkout"});
	}

	setShop = () => {
		this.setState({page: "shop"});
	}

	selectSession = (index) => {
		this.setState({selectedSession: this.state.sessions[index]});
	}

	checkEnabled = () => {
		if (this.state.selectedSession.id) return true;
		return false
	}

	componentDidMount() {
		appContext.appState.requestSessionsByDate(new Date(), (sessions) => {
			this.setState({sessions: sessions});
		})
	} 




	render() {

		const costs = appContext.appState.costs;
		const sessions = this.state.sessions;
		let sessionsHTML = (<div>Сеансов на эту дату нет</div>);
		if (sessions.length) {
			sessionsHTML = (sessions.map((session, i) => {
								const timeMatch = session.name.match(/^(\d+:\d+):\d+-(\d+:\d+):\d+/);
								const time = `${timeMatch[1]}-${timeMatch[2]}`;
								return(
									<li onClick={() => {this.selectSession(i)}} class={this.state.selectedSession.id == session.id ? "selected" : ""}>
										{time}
										<p>{session.price} р.</p>
									</li>
								)
							}))
		}

		let disabled = "disabled";
		if (this.checkEnabled()) { disabled = ""}

		const shop = (
			<div>

			<h1>ПОКУПКА БИЛЕТА</h1>
				<div className="ticket-settings">			
					<div className="ticket-date">
						<h2>Выберите дату поездки</h2>
						<DatePicker handleChange={this.setDate}/>
					</div>
					
					<div className="ticket-count">
						<h2>Выберите количество</h2>
						<Counter initValue={1} onChange={this.changeCount}/>
					</div>
				</div>
				<div className="sessions-section">
					<ul>
						{
							sessionsHTML
						}
					</ul>
				</div>
				<div className="submit-section">
					<button disabled={!this.checkEnabled()} className={"purchase-button " + `${disabled}`} onClick={this.submitTicket}>
						Купить
					</button>
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


























