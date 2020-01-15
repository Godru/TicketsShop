import HistoryAppContext from 'components/HistoryApp';
import UserPanelState from 'stores/UserPanelState';
import UserProfile from 'components/panel/UserProfile';
import UserIdentifiers from 'components/panel/UserIdentifiers';
import UserInvoices from 'components/panel/UserInvoices';
import UserTransactions from 'components/panel/UserTransactions';
import SuccessInvoice from 'components/panel/SuccessInvoice';
import FailInvoice from 'components/panel/FailInvoice';

import 'stylesheets/user-panel.less'

const routes = {
	'/': UserProfile,
	'/identifiers' : UserIdentifiers,
	'/invoices': UserInvoices,
	'/transactions': UserTransactions,
	'/success': SuccessInvoice,
	'/fail': FailInvoice,
}

const muiTheme = {
	fontFamily: "'WhitneyLight', Arial, Helvetica, sans-serif",
	palette: {
		primary1Color: '#00629b',
		primary2Color: '#00629b',
		// canvasColor: '#f6f2ec'
	}
}

let appContext = new HistoryAppContext({
	routes: routes,
	appState: UserPanelState,
	scriptUrl: '/assets/user-panel.js'
});

appContext.appState.effi.onLogout(function() {
	window.location.href = "/auth/login.html";
})

export default appContext;
export { appContext, muiTheme };