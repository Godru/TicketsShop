import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { appContext, muiTheme } from './UserApp';
import UserLayout from './UserLayout';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { RaisedButton, Paper, Divider, TextField} from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

@observer
export default class UserIdentifiers extends React.Component {
	constructor(props) {
		super(props);

		this.TABLE_MAX_WIDTH = 992;

		this.state = {
			showIdentifiersForm: false,
			tableView: (window.innerWidth <= this.TABLE_MAX_WIDTH ? false : true),
		}
	}

	handleResize = (event) => {
		let width = event.target.innerWidth;
		if(width <= this.TABLE_MAX_WIDTH) {
			if(this.state.tableView) {
				this.setState({tableView: false});
			}
		} else {
			if(!this.state.tableView) {
				this.setState({tableView: true});
			}
		}
	}

	componentDidMount() {
		appContext.appState.requestCurrentIdentifiers((data) => {this.forceUpdate()});
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	toggleIdentifiersForm = () => {
		this.setState({showIdentifiersForm: !this.state.showIdentifiersForm});
	}


	render() {
		let identifiersForm = (
			<div className="profile-line">
				<div className="identifiers-btn"><RaisedButton onClick={this.toggleIdentifiersForm}>Привязать карту</RaisedButton></div>
			</div>
		);
		if(this.state.showIdentifiersForm) {
			identifiersForm = (
				<div className="profile-line">
					<TextField hintText="Номер карты" className="profile-text-field" name="card"/>
					<div className="identifiers-btn"><RaisedButton onClick={()=> {}}>Привязать</RaisedButton></div>
					<div className="identifiers-btn"><RaisedButton onClick={this.toggleIdentifiersForm}>Отмена</RaisedButton></div>
				</div>
			);
		}
		let tableContent = [];
		const identifiers = appContext.appState.identifiers;
		if(identifiers) {
			for(let i = 0; i < identifiers.length; i++){
				if(i > 0 && !this.state.tableView) {
					tableContent.push(
						<TableHeader key={i+identifiers.length} adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
							<TableRow>
								<TableHeaderColumn>Номер пропуска</TableHeaderColumn>
								<TableHeaderColumn>Действителен с</TableHeaderColumn>
								<TableHeaderColumn>Действителен по</TableHeaderColumn>
								<TableHeaderColumn>Правило использования</TableHeaderColumn>
								<TableHeaderColumn>Наименование категории</TableHeaderColumn>
								<TableHeaderColumn>Наименование тарифа</TableHeaderColumn>
							</TableRow>
						</TableHeader>
					);
				}
				tableContent.push(
					<TableRow key={i}>
						<TableRowColumn>{identifiers[i].code}</TableRowColumn>
						<TableRowColumn>{identifiers[i].local_valid_from}</TableRowColumn>
						<TableRowColumn>{identifiers[i].local_valid_to}</TableRowColumn>
						<TableRowColumn>{identifiers[i].permanent_rule}</TableRowColumn>
						<TableRowColumn>{identifiers[i].category}</TableRowColumn>
						<TableRowColumn>{identifiers[i].rate}</TableRowColumn>
					</TableRow>
				);
			}
		}

		let table;
		if(!this.state.tableView) {
			table = (
				<TableBody className="panel-table" displayRowCheckbox={false} showRowHover={true}>
					<TableHeader adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
						<TableRow>
							<TableHeaderColumn>Номер пропуска</TableHeaderColumn>
							<TableHeaderColumn>Действителен с</TableHeaderColumn>
							<TableHeaderColumn>Действителен по</TableHeaderColumn>
							<TableHeaderColumn>Правило использования</TableHeaderColumn>
							<TableHeaderColumn>Наименование категории</TableHeaderColumn>
							<TableHeaderColumn>Наименование тарифа</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					{tableContent}
				</TableBody>
			);
		} else {
			table = [
				(<TableHeader key={-1} adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
					<TableRow>
						<TableHeaderColumn>Номер пропуска</TableHeaderColumn>
						<TableHeaderColumn>Действителен с</TableHeaderColumn>
						<TableHeaderColumn>Действителен по</TableHeaderColumn>
						<TableHeaderColumn>Правило использования</TableHeaderColumn>
						<TableHeaderColumn>Наименование категории</TableHeaderColumn>
						<TableHeaderColumn>Наименование тарифа</TableHeaderColumn>
					</TableRow>
				</TableHeader>),
				(<TableBody key={0} className="panel-table" displayRowCheckbox={false} showRowHover={true}>
					{tableContent}
				</TableBody>)
			];
		}
		return (
			<div className="identifiers" id="panel_table">
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
			<UserLayout selected="identifiers" linksid={this.props.linksid}>
				<h2>Скипассы</h2>
				{/*<div className="identifiers-form">
								<Paper zDepth={1} className="identifiers-paper">
									{identifiersForm}
								</Paper>
				</div>*/}
				<Paper zDepth={1} className="panel-paper">
					<Table selectable={false}>
						{table}
					</Table>
				</Paper>
			</UserLayout>
			</MuiThemeProvider>
			</div>
		);
	}
}

let identifier = {
	category:"Правило оформления",
	code:"1",
	id:176,
	personid:2,
	rate:"Тариф 1",
	permanent_rule:"правило пользования",
	local_valid_from: "Wed Oct 04 2017 14:33:00 GMT+0300 (RTZ 2 (зима))",
	local_valid_to: "Thu Oct 04 2018 14:33:00 GMT+0300 (RTZ 2 (зима))",
}

let identifiersTest = [
	{
	category:"Правило оформления",
	code:"1",
	id:176,
	personid:2,
	rate:"Тариф 1",
	permanent_rule:"правило пользования",
	local_valid_from: "Wed Oct 04 2017 14:33:00 GMT+0300 (RTZ 2 (зима))",
	local_valid_to: "Thu Oct 04 2018 14:33:00 GMT+0300 (RTZ 2 (зима))",
},
{
	category:"Правило оформления",
	code:"1",
	id:176,
	personid:2,
	rate:"Тариф 1",
	permanent_rule:"правило пользования",
	local_valid_from: "Wed Oct 04 2017 14:33:00 GMT+0300 (RTZ 2 (зима))",
	local_valid_to: "Thu Oct 04 2018 14:33:00 GMT+0300 (RTZ 2 (зима))",
},
{
	category:"Правило оформления",
	code:"1",
	id:176,
	personid:2,
	rate:"Тариф 1",
	permanent_rule:"правило пользования",
	local_valid_from: "Wed Oct 04 2017 14:33:00 GMT+0300 (RTZ 2 (зима))",
	local_valid_to: "Thu Oct 04 2018 14:33:00 GMT+0300 (RTZ 2 (зима))",
}
]