import { observable, computed } from 'mobx';
import { EffiProtocol, serializeAURL} from 'lib/effi_protocol';

export default class UserPanelState {
	@observable person = {};
	@observable identifiers = [];
	@observable accounts = {};
	effi = new EffiProtocol();

	constructor(opts) {
		opts = opts || {};
		
		this.effi = new EffiProtocol({
			host: opts.host
		});
		this.host = opts.host;
	}

	setup = () => {
		// requestCurrentPerson();
	}


	requestCurrentPerson(callback) {
		
		this.effi.request({
			url: '/srv/Baloon/Person/GetCurrent',
			success: (data) => {
				this.person = data;
				callback(this.person);
			}
		});
	}

	requestCurrentIdentifiers(callback) {
		this.effi.request({
			url: '/srv/Baloon/Identifier/CurrentIdentifierListGet_FE',
			success: (data) => {
				this.identifiers = data || [];
				callback(data);
				for(let i = 0; i < this.identifiers.length; i++) {
					this.identifiers[i].local_valid_from = this.getLocaleDate(this.identifiers[i].valid_from);
					this.identifiers[i].local_valid_to = this.getLocaleDate(this.identifiers[i].valid_to);
				}
			}
		});
	}

	requestCurrentAccounts(callback) {
		this.effi.request({
			url: '/srv/Baloon/Person/GetCurrentAccounts',
			success: (data) => {
				this.accounts = data;
				callback(data);
			},
			error: (e) => {
				alert(`Произошла ошибка с загрузкой личных данных, попробуйте обновить страницу`);
			}
		});
	}

	requestCurrentTransactions(callback) {
		this.effi.request({
			url: '/srv/Baloon/Transaction/CurrentTransactionListGet_FE',
			success: (data) => {
				this.transactions = data;
				callback(data);
			},
			error: (e) => {
				alert(`Произошла ошибка с загрузкой списка транзакций, попробуйте обновить страницу`);
			}
		});
	}

	requestRaiseInvoice(amount, callback) {
		let data = `amount=decimal:s:${amount}&&`;
		let success = `success_url=s:${this.host + "/user#/success"}&`;
		let fail = `fail_url=s:${this.host + "/user#/fail"}&`;
		data += success + fail;
		console.log("data: ", data);
		this.effi.request({
			url: '/srv/Baloon/PersonInvoice/RaiseInvoiceForCurrentUser',
			data: data,
			success: (response) => {
				console.log(response);
				callback(response);
			},
			error: (e) => {
				console.log(e);
				alert(`Произошла ошибка, попробуйте повторить оперцию`);
			}
		});
	}

	updateProfile(data, callback) {
		this.effi.request({
			url: '/srv/Baloon/Person/UpdateCurrent',
			data: data,
			success: () => {
				callback();
			},
			error: (e) => {
				alert(`Произошла ошибка, попробуйте повторить оперцию`);
			}
		});
	}

	changePassword(data, callback) {
		this.effi.request({
			url: '/srv/Baloon/Person/ChangeCurrentPassword',
			data: data,
			success: () => {
				if (typeof callback == 'function') callback();
			},
			error: (e) => {
				console.log("error:", e);
			}
		});
	}

	buildAURL(data) {
		let formatted = {};
		for(let key in data) {
			if(key == "birthdate") {
				formatted[key] = {type: "date", value: data[key]};
			} else {
				formatted[key] = {type: typeof(data[key]), value: data[key]};
			}
		}
		return serializeAURL(formatted);
	}

	getLocaleDate = (date) => {
		if(!date) return "";
		let day = date.getDate();
		let month = MONTHS[date.getMonth()];
		let year = date.getFullYear();
		return `${day} ${month} ${year}`;
	}

	getLocaleGender = (gender) => {
		if(!gender) return "";
		return `${GENDERS[gender]}`;
	}

}

const GENDERS = {
	'man': 'Мужской',
	'lady': 'Женский'
}

const MONTHS = {
	0: "Января",
	1: "Февраля",
	2: "Марта",
	3: "Апреля",
	4: "Мая",
	5: "Июня",
	6: "Июля",
	7: "Августа",
	8: "Сентября",
	9: "Октября",
	10: "Ноября",
	11: "Декабря"
}
