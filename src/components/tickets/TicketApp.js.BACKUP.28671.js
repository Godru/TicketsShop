import HistoryAppContext from 'components/HistoryApp';
import TicketsState from 'stores/TicketsState';
import ShopPage from 'components/tickets/ShopPage';
import Checkout from 'components/tickets/Checkout';
import OrderSuccess from 'components/tickets/OrderSuccess';
import OrderFail from 'components/tickets/OrderFail';
// import UserIdentifiers from 'components/panel/UserIdentifiers';
// import UserInvoices from 'components/panel/UserInvoices';
// import UserTransactions from 'components/panel/UserTransactions';
// import SuccessInvoice from 'components/panel/SuccessInvoice';
// import FailInvoice from 'components/panel/FailInvoice';

// import 'stylesheets/user-panel.less'
import 'stylesheets/date-picker.less';
import 'stylesheets/tickets-shop.less';

const routes = {
	'/': ShopPage,
	'/checkout': Checkout,
	'/success': OrderSuccess,
	'/fail': OrderFail,
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
	appState: TicketsState,
	scriptUrl: '/assets/tickets-shop.js',
	host: "http://62.76.176.164"
<<<<<<< HEAD
	//host: "http://ab1024.computerica.com"
=======
    //host: "http://localhost:1025"
>>>>>>> b1d440ca5a2a62f5ae6316786cebeb329b42a9dc
});

appContext.appState.effi.onLogout(function() {
	window.location.href = "/auth/login.html";
})

export default appContext;
export { appContext, muiTheme };
