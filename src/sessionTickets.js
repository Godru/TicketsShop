// import appContext from 'components/tickets/TicketApp';
import ReactDOM from 'react-dom';
import React from 'react';
import ShopPage from 'components/tickets/SessionShopPage';
import 'stylesheets/date-picker.less';
import 'stylesheets/tickets-shop.less';


window.baloonTicketApp = function(htmlid, linksid) {

	// appContext.render(htmlid, linksid);
	ReactDOM.render(React.createElement(ShopPage), document.getElementById(htmlid));
}
