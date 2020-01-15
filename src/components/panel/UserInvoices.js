import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { appContext, muiTheme } from './UserApp';
import UserLayout from './UserLayout';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { RaisedButton, Paper, Divider, TextField, SelectField, MenuItem, DatePicker, Snackbar } from 'material-ui';


@observer
export default class UserIvoices extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			raiseInvoiceForm: false,
			amount: 0
		}
	}

	componentDidMount() {
		appContext.appState.requestCurrentAccounts((data) => {this.forceUpdate()});
	}

	toggleRaiseInvoiceForm = () => {
		this.setState({raiseInvoiceForm: !this.state.raiseInvoiceForm});
	}

	handleFieldChange = (key, val) => {
		this.setState({[key]: val});
	}

	handleRaiseInvoice = () => {
		appContext.appState.requestRaiseInvoice(parseInt(this.state.amount), (response) => {
			window.location.href = response.action_url;
		})
	}

	render() {
		let accountsList = [];
		let accounts = appContext.appState.accounts;
		if(accounts && Object.keys(accounts).length) {
			let i = 1;
			for(let key in accounts) {
				accountsList.push(
					<div key={i}>
						<div className="profile-line">
							<label>Счет {i++}</label>
							<div>
								<span>Баланс: {`${accounts[key]} ${key}`}</span>
							</div>
						</div>
						<Divider/>
					</div>
				);
			}
		}

		let raiseInvoice;
		if(this.state.raiseInvoiceForm) {
			raiseInvoice = (
				<div>
					<div className="profile-line">
						<label>Сумма пополнения</label>
						<div><TextField hintText="Введите сумму" className="profile-text-field" name="amount" 
								onChange={(p1, val) => {this.handleFieldChange("amount", val)}}/></div>
					</div>
					<div className="profile-line">
						<div className="profile-line"><RaisedButton className="medium-width" onClick={this.handleRaiseInvoice}>Подтвердить</RaisedButton></div>
						<div className="profile-line"><RaisedButton className="medium-width" onClick={this.toggleRaiseInvoiceForm}>Отмена</RaisedButton></div>
					</div>
					<div className="profile-line paytool-message">
						Для оплаты (ввода реквизитов Вашей карты) Вы будете перенаправлены на платежный шлюз ПАО СБЕРБАНК. Соединение
с платежным шлюзом и передача информации осуществляется в защищенном режиме с использованием протокола
шифрования SSL. В случае если Ваш банк поддерживает технологию безопасного проведения интернет-платежей Verified
By Visa или MasterCard SecureCode для проведения платежа также может потребоваться ввод специального пароля.
Настоящий сайт поддерживает 256-битное шифрование. Конфиденциальность сообщаемой персональной информации
обеспечивается ПАО СБЕРБАНК. Введенная информация не будет предоставлена третьим лицам за исключением случаев,
предусмотренных законодательством РФ. Проведение платежей по банковским картам осуществляется в строгом
соответствии с требованиями платежных систем МИР, Visa Int. и MasterCard Europe Sprl.
					</div>
				</div>
			)
		} else {
			raiseInvoice = (
				<div className="profile-line">
					<RaisedButton className="single-button" onClick={this.toggleRaiseInvoiceForm}>Пополнить баланс</RaisedButton>
				</div>
			)
		}
		
		return (

			<div className="profile">
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
			<UserLayout selected="invoices" linksid={this.props.linksid}>
				<Paper zDepth={1} className="profile-paper">
					<div className="profile-header">
						<h2>Мои Счета</h2>
					</div>
					<Divider/>
					{accountsList}
					{raiseInvoice}
				</Paper>
			</UserLayout>
			</MuiThemeProvider>
			</div>
		);
	}
}
