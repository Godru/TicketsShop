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
		appContext.appState.requestCurrentTransactions((data) => {this.forceUpdate()});
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	toggleIdentifiersForm = () => {
		this.setState({showIdentifiersForm: !this.state.showIdentifiersForm});
	}


	render() {
		let tableContent = [];
		const transactions = appContext.appState.transactions;
		if(transactions) {
			for(let i = 0; i < transactions.length; i++){
				if(i > 0 && !this.state.tableView) {
					tableContent.push(
						<TableHeader key={i+transactions.length} adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
							<TableRow>
								<TableHeaderColumn>Описание</TableHeaderColumn>
								<TableHeaderColumn>Сумма</TableHeaderColumn>
							</TableRow>
						</TableHeader>
					);
				}
				tableContent.push(
					<TableRow key={i}>
						<TableRowColumn>{transactions[i].comment}</TableRowColumn>
						<TableRowColumn>{transactions[i].amount} {transactions[i].currency}</TableRowColumn>
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
							<TableHeaderColumn>Описание</TableHeaderColumn>
							<TableHeaderColumn>Сумма</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					{tableContent}
				</TableBody>
			);
		} else {
			table = [
				(<TableHeader key={-1} adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
					<TableRow>
						<TableHeaderColumn>Описание</TableHeaderColumn>
						<TableHeaderColumn>сумма</TableHeaderColumn>
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
			<UserLayout selected="transactions" linksid={this.props.linksid}>
				<h2>Список транзакций</h2>
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
