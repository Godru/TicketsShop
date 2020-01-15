import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createHashHistory';
import Route from 'route-parser';
import { observer } from 'mobx-react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Screen404 from 'components/Screen404';


function HistoryAppContext(opts) {
	let context = this;
	this.app = null;
	this.appState = null;

	this.onHistoryChange = function(location, action) {
		if (context.app == null) return;
		let params = urlParameters(location.search);
		if (context.appState.locationChange) context.appState.locationChange(params);
		openPath(location.pathname, params);
	}


	this.host = opts.host || (opts.scriptUrl ? getCurrentScriptUrl(opts.scriptUrl) : "");
	this.history = createHistory();
	this.unlisten = this.history.listen(this.onHistoryChange);
	const params = urlParameters(this.history.location.search);
	this.appState = new opts.appState({host: this.host, ...params});
	this.routes = opts.routes || {};

	this.render = function(htmlid_, linksid) {
		let htmlid = htmlid_  || opts.htmlid || 'app-container';
		let elem = findOrCreateRootElement(htmlid);
		context.app = ReactDOM.render(
			<HistoryApp context={context} linksid={linksid}/>,
			elem
		);
		context.onHistoryChange(context.history.location, 'PUSH');
		return context.app;
	}

	function openPath(pathname, params) {
		for (let url in context.routes) {
			let route = new Route(url);
			let m = route.match(pathname);
			if (m) {
				context.app.openScreen(context.routes[url], false, m, params);
				return;
			}
		}
		context.app.openScreen(Screen404, false, params);
	}

	@observer
	class HistoryApp extends React.Component {

		constructor(props, context) {
			super(props, context);

			this.state = {
				screen: null,
				requires_auth: false
			};
		}

		componentWillMount() {
			injectTapEventPlugin();
		}

		openScreen = (screen, requires_auth, url_args, params) => {
			this.setState({
				screen: screen,
				requires_auth: requires_auth,
				url_args: url_args,
				url_parameters: params
			});
		}

		render() {
			let Screen = this.state.screen;
			if (!Screen) Screen = Screen404;
			return (
				<div className="app-wrapper">
					<Screen host={context.host} url_args={this.state.url_args} url_parameters={this.state.url_parameters}
						appState={context.appState} context={context} linksid={this.props.linksid}/>
				</div>
			);
		}
	}


}


function urlParameters(search) {
	var query_string = {};
	var query = search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}

function getCurrentScriptUrl(script_url_search) {
	let scripts = document.getElementsByTagName('script');
	let index = scripts.length - 1;
	for (; index >= 0; index--) {
		let script = scripts[index],
			addr_pos = script.src.indexOf(script_url_search);
		if (addr_pos > 0) {
			return script.src.substr(0, addr_pos);
		}
	}
	return null;
}


function findOrCreateRootElement(htmlid_) {
	let htmlid = htmlid_ || 'app-container';
	let elem = document.getElementById(htmlid);
	if (!elem) {
		elem = document.createElement("div");
		elem.setAttribute('id', htmlid);
		document.body.appendChild(elem);
	};
	return elem;
}

export default HistoryAppContext;
