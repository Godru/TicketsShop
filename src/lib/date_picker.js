import React from 'react';

// import 'stylesheets/font-awesome-4.7.0/less/font-awesome.less';

const RU = {
	months: {
		0: 'Январь',
		1: 'Февраль',
		2: 'Март',
		3: 'Апрель',
		4: 'Май',
		5: 'Июнь',
		6: 'Июль',
		7: 'Август',
		8: 'Сентябрь',
		9: 'Октябрь',
		10: 'Ноябрь',
		11: 'Декабрь'
	},
	date_months: {
		0: 'Января',
		1: 'Февраля',
		2: 'Марта',
		3: 'Апреля',
		4: 'Мая',
		5: 'Июня',
		6: 'Июля',
		7: 'Августа',
		8: 'Сентября',
		9: 'Октября',
		10: 'Ноября',
		11: 'Декабря'
	},
	days: {
		0: 'ПН',
		1: 'ВТ',
		2: 'СР',
		3: 'ЧТ',
		4: 'ПТ',
		5: 'СБ',
		6: 'ВС'
	},
	days_long: {
		0: 'понедельник',
		1: 'вторник',
		2: 'среда',
		3: 'четверг',
		4: 'пятница',
		5: 'суббота',
		6: 'воскресенье'
	}
}

function getWeekdayOffset(date) {
	let day = date.getDay();
	return (day == 0 ? 7 : day) - 1;
}
export function longHumanDate(date, locale = RU) {
	return date.getDate() + ' ' + locale.date_months[date.getMonth()].toLowerCase() + ', ' + locale.days_long[getWeekdayOffset(date)];
}
export function htmlDate(date, locale = RU) {
	return [
		<span class="weekday_long" key="weekday_long">{locale.days_long[getWeekdayOffset(date)]}</span>,
		<span class="weekday_short" key="weekday_short">{locale.days[date.getDay()]}</span>,
		<span class="monthday_number" key="monthday_number">{date.getDate()}</span>,
		<span class="month_number" key="month_number">{locale.date_months[date.getMonth()]}</span>,
		<span class="year_number" key="year_number">{date.getYear() + 1900}</span>,
	];
	// return date.getDate() + ' ' + locale.date_months[date.getMonth()].toLowerCase() + ', ' + locale.days_long[getWeekdayOffset(date)];
}

export function parseDate(dateString) {
	if(dateString.indexOf(".")) {
		let parts = dateString.split(".");
		dateString = Array.join([parts[1], parts[0], parts[2]], ".");
	}
	let date = new Date(dateString);
	if (typeof(date.getMonth) === 'function') return date;
	return new Date();
}

export class DatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: this.props.initDate || new Date(),
			pageInitDate: this.props.initDate || new Date()
		}
	}

	showPrevMonth = () => {
		let year = this.state.pageInitDate.getFullYear();
		let month = this.state.pageInitDate.getMonth();
		if(month == 0) {
			year--;
			month = 11;
		} else month--;
		this.setState({pageInitDate: new Date(year, month, 1)});
	}

	showNextMonth = () => {
		let year = this.state.pageInitDate.getFullYear();
		let month = this.state.pageInitDate.getMonth();
		if(month == 11) {
			year++;
			month = 0;
		} else month++;
		this.setState({pageInitDate: new Date(year, month, 1)});
	}

	getCSSClasses = (date) => {
		let sel = this.state.date;
		if(date.getFullYear() == sel.getFullYear() && date.getMonth() == sel.getMonth() && date.getDate() == sel.getDate()) {
			return "selected";
		}
		return "";
	}

	getDisabledDates = (date) => {
		let res = false;
		if(this.props.getDisabledDates) res = this.props.getDisabledDates(date);
		res = res ? res : this.defaultRestrictedDates(date);
		return res;
	}

	defaultRestrictedDates = (date) => {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		if (date < yesterday) return true;
		return false;
	}

	selectDate = (date) => {
		this.setState({date: date}, () => {
			if(this.props.handleChange) this.props.handleChange(this.state.date);
		});
	}

	render() {

		return(
			<div className="date-picker">
				<MonthSelector pageInitDate={this.state.pageInitDate} locale={this.props.locale.months}
					showPrevMonth={this.showPrevMonth}showNextMonth={this.showNextMonth}/>
				<CalendarBlock getCSSClasses={this.getCSSClasses} date={this.state.date}
					pageInitDate={this.state.pageInitDate} locale={this.props.locale.days}
					selectDate={this.selectDate} getDisabledDates={this.getDisabledDates}/>
			</div>
		)
	}
}

DatePicker.defaultProps = {locale: RU};

export class RangePicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstDate: this.props.firstInitDate,
			secondDate: this.props.secondInitDate,
			firstPageInitDate: this.props.firstInitDate || new Date(),
			secondPageInitDate: this.props.secondInitDate || new Date(),
			singleSelected: null
		}
	}

	datesEqual = (date1, date2) => {
		if(date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear()){
			return true;
		}
		return false;
	}

	firstPrevMonth = () => {
		let year = this.state['firstPageInitDate'].getFullYear();
		let month = this.state['firstPageInitDate'].getMonth();
		if(month == 0) {
			year--;
			month = 11;
		} else month--;
		this.setState({['firstPageInitDate']: new Date(year, month, 1)});
	}

	firstNextMonth = () => {
		let firstYear = this.state["firstPageInitDate"].getFullYear();
		let firstMonth = this.state["firstPageInitDate"].getMonth();
		let secondYear = this.state["secondPageInitDate"].getFullYear();
		let secondMonth = this.state["secondPageInitDate"].getMonth();
		if(firstMonth == 11) {
			firstYear++;
			firstMonth = 0;
		} else firstMonth++;
		if(this.datesEqual(new Date(firstYear, firstMonth, 1), new Date(secondYear, secondMonth, 1))) {
			this.secondNextMonth();
		}

		this.setState({["firstPageInitDate"]: new Date(firstYear, firstMonth, 1)});
	}

	secondPrevMonth = () => {
		let firstYear = this.state["firstPageInitDate"].getFullYear();
		let firstMonth = this.state["firstPageInitDate"].getMonth();
		let secondYear = this.state["secondPageInitDate"].getFullYear();
		let secondMonth = this.state["secondPageInitDate"].getMonth();
		if(secondYear == 0) {
			secondMonth--;
			secondYear = 11;
		} else secondMonth--;
		if(this.datesEqual(new Date(firstYear, firstMonth, 1), new Date(secondYear, secondMonth, 1))) {
			this.firstPrevMonth();
		}

		this.setState({["secondPageInitDate"]: new Date(secondYear, secondMonth, 1)});
	}

	secondNextMonth = () => {
		let year = this.state['secondPageInitDate'].getFullYear();
		let month = this.state['secondPageInitDate'].getMonth();
		if(month == 11) {
			year++;
			month = 0;
		} else month++;
		this.setState({['secondPageInitDate']: new Date(year, month, 1)});
	}

	// showPrevMonth = (dateKey) => {
	// 	let year = this.state[dateKey].getFullYear();
	// 	let month = this.state[dateKey].getMonth();
	// 	if(month == 0) {
	// 		year--;
	// 		month = 11;
	// 	} else month--;
	// 	this.setState({[dateKey]: new Date(year, month, 1)});
	// }

	// showNextMonth = (dateKey) => {
	// 	let year = this.state[dateKey].getFullYear();
	// 	let month = this.state[dateKey].getMonth();
	// 	if(month == 11) {
	// 		year++;
	// 		month = 0;
	// 	} else month++;
	// 	this.setState({[dateKey]: new Date(year, month, 1)});
	// }

	datesEqual = (date1, date2) => {
		if(!(date1 && date2)) return false;
		return(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate());
	}

	getCSSClasses = (date) => {
		let firstDate = this.state.firstDate;
		let secondDate = this.state.secondDate;
		let res = "";
		if(this.datesEqual(date, firstDate) || this.datesEqual(date, secondDate)) {
			res += " selected";
		} else if (date > firstDate && date < secondDate) res += " in-range";
		if(this.datesEqual(date, new Date())) res += " today";
		return res;
	}

	isInMinRange = (date) => {
		if(this.state.singleSelected) {
			for(let i = -this.props.minRange+1; i < this.props.minRange; i++) {
				let currentDate = new Date(this.state.firstDate);
				currentDate.setDate(currentDate.getDate() + i);
				if(this.datesEqual(date, currentDate)) return true;
			}
		}
		return false;
	}

	getDisabledDates = (date) => {
		let res = false;
		if(this.props.getDisabledDates) res = this.props.getDisabledDates(date);
		res = res ? res : this.isInMinRange(date);
		return res;
	}

	selectDate = (date) => {
		let singleSelected = this.state.singleSelected;
		if(!singleSelected) {
			this.setState({singleSelected: date, firstDate: date, secondDate: null});
			if (this.props.handleSingleSelected) this.props.handleSingleSelected(date);
		} else {
			if(date < singleSelected) {
				this.setState({firstDate: date, secondDate: singleSelected, singleSelected: null}, () => {this.giveDates()});
			} else {
				this.setState({firstDate: singleSelected, secondDate: date, singleSelected: null}, () => {this.giveDates()});
			}
		}
	}

	giveDates = () => {
		if(this.props.handleChange) this.props.handleChange(this.state.firstDate, this.state.secondDate);
	}

	render() {
		let first = this.state.firstDate;
		let second = this.state.secondDate;
		let next = false;
		if(first && second){
			next = this.state.firstDate.getMonth() == this.state.secondDate.getMonth();
		} else if (!first && !second) next = true;
		return(
			<div className="date-picker range-picker">
				<div>
					<MonthSelector pageInitDate={this.state.firstPageInitDate} locale={this.props.locale.months}
						showPrevMonth={() =>{this.firstPrevMonth()}} showNextMonth={() =>{this.firstNextMonth()}}/>
					<CalendarBlock getCSSClasses={this.getCSSClasses} getDisabledDates={this.getDisabledDates}
						pageInitDate={this.state.firstPageInitDate} locale={this.props.locale.days}
						selectDate={this.selectDate}/>
				</div>
				<div>
					<MonthSelector pageInitDate={this.state.secondPageInitDate} locale={this.props.locale.months} next={next}
						showPrevMonth={() => {this.secondPrevMonth()}}showNextMonth={() =>{this.secondNextMonth()}}/>
					<CalendarBlock getCSSClasses={this.getCSSClasses} getDisabledDates={this.getDisabledDates}
						pageInitDate={this.state.secondPageInitDate} locale={this.props.locale.days}
						selectDate={this.selectDate}/>
				</div>
			</div>
		)
	}
}

RangePicker.defaultProps = {locale: RU};

export class InlineDatePicker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			date: this.props.currentDate || this.props.initDate || new Date(),
			pageInitDate: this.props.initDate || new Date(),
			nextDisabled: false,
			prevDisabled: false,
			showBlock: false,
		}
	}

	componentDidMount() {
		this.checkButtonsAvailable(new Date());
		if(!this.props.hideOnSelect) this.switchBlock();
	}

	selectDate = (date) => {
		this.setState({date: date}, () => {
			if(this.props.handleChange) this.props.handleChange(this.state.date);
			if(this.props.hideOnSelect) this.hideBlock();
		});
	}

	setNextDate = (date) => {
		if (this.state.nextDisabled) return;
		date.setDate(date.getDate() + 1);
		this.selectDate(date);
		this.checkButtonsAvailable(date);
	}

	setPrevDate = (date) => {
		if (this.state.prevDisabled) return;
		date.setDate(date.getDate() - 1);
		this.selectDate(date);
		this.checkButtonsAvailable(date);
	}

	checkButtonsAvailable = (date) => {
		let next = new Date(date);
		next.setDate(date.getDate() + 1);
		let prev = new Date(date);
		prev.setDate(date.getDate() - 1);
		if(this.getDisabledDates(next)) {
			this.setState({nextDisabled: true});
		} else {
			this.setState({nextDisabled: false});
		}
		if(this.getDisabledDates(prev)) {
			this.setState({prevDisabled: true});
		} else {
			this.setState({prevDisabled: false});
		}
	}

	hideBlock = () => {
		if(this.state.showBlock) this.setState({showBlock: false});
	}

	switchBlock = () => {
		this.setState({showBlock: !this.state.showBlock});
	}

	getDisabledDates = (date) => {
		if(this.props.getDisabledDates) return this.props.getDisabledDates(date);
		return false;
	}

	render() {
		let datestr = longHumanDate(this.state.date, this.props.locale);
		let prevCls = this.state.prevDisabled ? "disabled" : "";
		let nextCls = this.state.nextDisabled ? "disabled" : "";
		let block = null;
		if(this.state.showBlock) {
			block = (<CalendarBlock locale={this.props.locale.days} selectDate={this.selectDate} inline={true} keepToday={this.props.keepToday} inlineCount={this.props.inlineCount}
					currentDate={this.props.currentDate} pageInitDate={this.state.pageInitDate} />);
		}
		return(
			<div className="date-picker inline-picker">
				{block}
				<i class={"btn fa fa-arrow-left " + prevCls} aria-hidden="true" onClick={() => {this.setPrevDate(this.state.date)}}></i>
				<a href="#" class="curr-date-container" onClick={this.switchBlock}>
					<i class="fa fa-calendar" aria-hidden="true"></i>
					<span class="curr-date">{datestr}</span>
				</a>
				<i class={"btn fa fa-arrow-right " + nextCls} aria-hidden="true" onClick={() => {this.setNextDate(this.state.date)}}></i>
				{/*<button class="btn button-today" onClick={() => {this.selectDate(new Date())}}>Сегодня</button>*/}
				<button class="btn button-tomorrow" onClick={() => {this.setNextDate(new Date())}}>Завтра</button>
			</div>
		);
	}
}

InlineDatePicker.defaultProps = {locale: RU, inlineCount: 7};


class MonthSelector extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if(this.props.next) this.props.showNextMonth();
	}
	render() {

		let month = this.props.locale[this.props.pageInitDate.getMonth()];
		let year = this.props.pageInitDate.getFullYear();

		return(
			<div className="calendar-header">
				<div className="prev-month" onClick={this.props.showPrevMonth}>
					<i className="prev-img"></i>
				</div>
				<div className="header-caption">
					<h2 className="month">{month} <span>-</span></h2>
					<h2 className="year"> {year}</h2>
				</div>
				<div className="next-month" onClick={this.props.showNextMonth}>
					<i className="next-img"></i>
				</div>
			</div>
		);
	}
}


class CalendarBlock extends React.Component {
	constructor(props) {
		super(props);
		
	}

	selectDate = (date) => {
		if(this.props.selectDate) this.props.selectDate(date)
	}

	getMonthDates = (date) => {
		const month = date.getMonth();
		let day = new Date(date.getFullYear(), month, 1);
		let dates = [];
		while(day.getMonth() === month) {
			dates.push(day.getDate());
			day.setDate(day.getDate() + 1);
		}

		return dates;
	}

	getDayOffset = (date) => {
		let day = date.getDay();
		return (day == 0 ? 7 : day) - 1;
	}

	getWeekdays = (date, count) => {
		let res = [];
		let day = new Date(date);
		if(this.props.keepToday) day = new Date();
		const days = this.props.locale;
		for(let i = 0; i < count; i++) {
			if(this.props.inline) {
				let iterDate = new Date(date);
				if(this.props.keepToday) iterDate = new Date();
				iterDate.setDate(iterDate.getDate() + i);
				res.push(<th key={i} onClick={() => {this.selectDate(new Date(iterDate))}}>{days[this.getDayOffset(day)]}</th>)
			} else {
				res.push(<th key={i}>{days[this.getDayOffset(day)]}</th>);
			}
			day.setDate(day.getDate() + 1);
		}
		return res;
	}

	generateInlineDatesStructure = (date, currentDate_) => {
		let currentDate = new Date(currentDate_.getFullYear(), currentDate_.getMonth(), currentDate_.getDate());
		let res;
		let row = [];
		for (let i=0; i < this.props.inlineCount; i++) {
			let iterDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			if(this.props.keepToday) {
				let today = new Date()
				iterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			}
			iterDate.setDate(iterDate.getDate() + i);
			let is_current_date = (iterDate.getTime() == currentDate.getTime());
			row.push(
				<td key={i}>
					<CalendarDay label={htmlDate(iterDate)}
						handleClick={() => {this.selectDate(new Date(iterDate))}}
						cssClasses={""}
						disabled={false}
						is_current_date={is_current_date} />
				</td>
			);
		}
		res = (<tr class="weekline">{row}</tr>);
		return res;
	}

	generateDatesStructure = (date, currentDate_) => {
		currentDate_ = currentDate_ || date || new Date();
		let currentDate = new Date(currentDate_.getFullYear(), currentDate_.getMonth(), currentDate_.getDate());
		let firstDay = new Date(date);
		firstDay.setDate(1);
		let dates = this.getMonthDates(firstDay);
		let offset = this.getDayOffset(firstDay);
		for (let i = 0; i < offset; i++) {
			dates.unshift("");
		}

		let res = [];
		let row = [];
		let i = 1;
		let n = 0;
		for(let j=0; j < dates.length; j++) {
			let iterDate = new Date(date.getFullYear(), date.getMonth(), dates[j]);
			let is_current_date = (iterDate.getTime() == currentDate.getTime());
			row.push(
				<td key={n++}>
					<CalendarDay label={dates[j]}
						handleClick={() => {this.selectDate(iterDate)}}
						cssClasses={this.props.getCSSClasses(iterDate)}
						disabled={this.props.getDisabledDates(iterDate)}
						is_current_date={is_current_date} />
				</td>
			);
			if (i == 7) {
				res.push(<tr key={n++}>{row}</tr>);
				i = 0;
				row = [];
			}
			i++;
		}
		if (i != 0) res.push(row);
		return res;
	}

	render() {
		const days = this.props.locale;
		let weekDays = [
			(<th key={1}><div className="weekDay-cell">{days[0]}</div></th>),
			(<th key={2}><div className="weekDay-cell">{days[1]}</div></th>),
			(<th key={3}><div className="weekDay-cell">{days[2]}</div></th>),
			(<th key={4}><div className="weekDay-cell">{days[3]}</div></th>),
			(<th key={5}><div className="weekDay-cell">{days[4]}</div></th>),
			(<th key={6}><div className="weekDay-cell">{days[5]}</div></th>),
			(<th key={7}><div className="weekDay-cell">{days[6]}</div></th>)
		];

		let dates;
		if(this.props.inline) {
			dates = this.generateInlineDatesStructure(this.props.pageInitDate, this.props.currentDate);
			weekDays = this.getWeekdays(this.props.pageInitDate, this.props.inlineCount);
		} else {
			dates = this.generateDatesStructure(this.props.pageInitDate, this.props.currentDate);
		}

		return(
			<div className="calendar-block-container">
				<table className="calendar">
					<tbody>
						<tr class="weekdays">
							{weekDays}
						</tr>
						{dates}
					</tbody>
				</table>
			</div>
		);
	}
}

class CalendarDay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			shrinked: false
		}
	}

	handleClick = () => {
		if(!this.props.disabled) this.props.handleClick();
	}

	toggleShrinked = () => {
		this.setState({shrinked: !this.state.shrinked})
	}

	render(){
		let cls = this.props.label ? this.props.cssClasses : "";
		if (this.props.disabled) cls += " disabled";
		if (this.state.shrinked) cls += " shrinked";
		if (this.props.is_current_date) cls += " current";
		return(
			<div onClick={this.handleClick} onMouseDown={this.toggleShrinked} onMouseUp={this.toggleShrinked} className={"calendar-date " + cls}>
				{this.props.label}
			</div>
		);
	}
}
