import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import appContext from './UserApp';

@observer
export default class UserLayout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		}
	}

	setAuthLinks = (name, linksid) => {
		let links = document.getElementById(linksid);
		if(links) {
			let firstLink = links.getElementsByTagName('a')[0];
			let secondLink = links.getElementsByTagName('a')[1];
			firstLink.innerHTML = name;
			firstLink.href = "#/";
			secondLink.innerHTML = "Выход";
			secondLink.href = "/ru_RU/#logout";
		}
		
	}

	componentDidMount() {
		appContext.appState.requestCurrentPerson((data) => {
			let name = `${data.last_name} ${data.first_name}`;
			if(!data.last_name && !data.first_name) name = data.email;
			this.setAuthLinks(name, this.props.linksid);
		})
	}

	render() {
		let profile_cls = "btn" + (this.props.selected == "profile" ? " sel" : "");
		let identifiers_cls = "btn" + (this.props.selected == "identifiers" ? " sel" : "");
		let invoices_cls = "btn" + (this.props.selected == "invoices" ? " sel" : "");
		let transactions_cls = "btn" + (this.props.selected == "transactions" ? " sel" : "");
		
		return (
			<div>
				<div class="menubar">
					<a href="#/" class={profile_cls}>Личная информация</a>
					<a href="#/identifiers" class={identifiers_cls}>Мои ски-пассы</a>
					<a href="#/invoices" class={invoices_cls}>Мои счета</a>
					<a href="#/transactions" class={transactions_cls}>Детализация</a>
				</div>
				{this.props.children}
			</div>
		);
	}
}
