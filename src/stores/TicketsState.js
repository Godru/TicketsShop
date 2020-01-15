import { observable, computed } from 'mobx';
import { EffiProtocol, serializeAURL, format_effi_date } from 'lib/effi_protocol';

export default class TicketsState {
	@observable order = {
		email: "",
		date: new Date(),
		count: 0,
		price: 0,
		id: 0,
		promo: "",
		discount: 0,
		rule: {
			index: 0,
			text: ""
		}
	};
	@observable rules = [];
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

	requestServiceRules(callback) {
		this.effi.request({
			url: '/nologin/srv/Baloon/IdentifierServiceRule/IdentifierServiceRuleListGet_API',
			success: (data) => {
				this.rules = data || [];
				this.costs = this.parseCosts(data);
				callback(data);
				
			},
			error: (err) => {
				console.log(err);
			}
		});
	}
    requestCheckPromo(promo,date, callback) {
        let data = `adate=ADate:s:${format_effi_date(date)}&&promocode=s:${promo}`;
        this.effi.request({
            url: '/nologin/srv/Baloon/PersonOrder/CheckPromocode_API',
            data: data,
            success: (data) => {
                this.order.discount = data || [];
                console.log(data);
                callback(data);

            },
            error: (err) => {
                console.log(err);
            }
        });
    }
    requestServiceRulesByDate(date, callback) {
        let data = `adate=ADate:s:${format_effi_date(date)}`;
        this.effi.request({
            url: '/nologin/srv/Baloon/WeekTariff/SeansesByDateListGet_FE',
			data: data,
            success: (data) => {
                this.rules = data || [];
                this.costs = this.parseCosts(data);
                callback(data);

            },
            error: (err) => {
                console.log(err);
            }
        });
    }

	requestPlaceAPI(callback) {
		console.log(this.host);
		let data = `email=s:${this.order.email}&adate=ADate:s:${format_effi_date(this.order.date)}&&week_tariffid=i:${this.order.id}&qty=i:${this.order.count}&promocode=s:${this.order.promo}`;
		console.log(data);
		this.effi.request({
			url: '/nologin/srv/Baloon/PersonOrder/Place_WEB',
			data: data,
			success: (data) => {
				callback(data);
				console.log(data);
				this.requestRaiseInvoice(data.amount, data.id, data["free"]);
			},
			error: (err) => {
				console.log(err);
			}
		});
	}

	requestRaiseInvoice(amount, orderid, free) {
		let data = `orderid=i:${orderid}&amount=decimal:s:${amount}&&`;
		data += `success_url=s:${encodeURIComponent(this.host + "/tickets-success-download")}&fail_url=s:${this.host + "/tickets-fail"}&`;
		console.log(data);
        free === "false" ? this.effi.request({
			url: '/nologin/srv/Baloon/PersonInvoice/RaiseInvoice_FE',
			data: data,
			success: (data) => {
				console.log(data);
				window.location.href = data.action_url;
			},
			error: (err) => {
				console.log(err);
			}
		}):  window.location.href = this.host + "/tickets-success";
	}

	openCheckout = () => {
		window.location.href = "#/checkout";
	}


	parseCosts = (data) => {
		let costs = [];
		data.map((item, i) => {
			costs.push({
				index: i,
				name: item.name,
				weekday_cost: item.weekday_cost,
				weekend_cost: item.weekend_cost
			})
		})
		return costs;
	}

}
//let data = `email=s:${this.order.email}&adate=ADate:s:${format_effi_date(this.order.date)}&&identifier_service_rulename=s:${encodeURIComponent(this.order.rule.text)}&qty=i:${this.order.count}`;