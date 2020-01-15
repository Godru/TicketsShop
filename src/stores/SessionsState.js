import { observable, computed } from 'mobx';
import { EffiProtocol, serializeAURL, format_effi_date } from 'lib/effi_protocol';

export default class TicketsState {
	@observable order = {
		email: "",
		date: new Date(),
		count: 0,
		session: {}
	};
	@observable sessions = [];
	@observable costs = [];
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

	requestSessionsByDate(date, callback) {
		const data = `adate=ADate:s:${format_effi_date(date)}&&`;
		console.log(data);
		this.effi.request({
			url: '/nologin/srv/Baloon/WeekTariff/SeansesByDateListGet_FE',
			data: data,
			success: (data) => {
				console.log(data);
				this.sessions = data || [];
				callback(data);
				
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	requestPlaceAPI(callback) {
		let data = `email=s:${this.order.email}&adate=ADate:s:${format_effi_date(this.order.date)}&&week_tariffid=i:${this.order.session.id}&qty=i:${this.order.count}`;
		console.log(data);
		this.effi.request({
			url: '/nologin/srv/Baloon/PersonOrder/Place_FE',
			data: data,
			success: (data) => {
				callback(data);
				console.log(data);
				this.requestRaiseInvoice(data.amount, data.id);
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	requestRaiseInvoice(amount, orderid) {
		let data = `orderid=i:${orderid}&amount=decimal:s:${amount}&&`;
		data += `success_url=s:${encodeURIComponent(this.host + "/tickets-success")}&fail_url=s:${this.host + "/tickets-fail"}&`;
		console.log(data);
		this.effi.request({
			url: '/nologin/srv/Baloon/PersonInvoice/RaiseInvoice_FE',
			data: data,
			success: (data) => {
				console.log(data);
				window.location.href = data.action_url;
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	openCheckout = () => {
		window.location.href = "#/checkout";
	}


}