import { EffiProtocol, serializeAURL } from 'lib/effi_protocol';

let effi = new EffiProtocol();

function gotoAdminPanel(language) {
	// console.log('go to admin')
	window.location.href = "/" + (language || "ru_RU") + "/";
}

function loginToPanel(opts) {
	opts.success = function(language) {
		effi.request({
			url: '/srv/Baloon/Person/GetCurrent',
			success: (resp) => {
				console.log(resp, resp.id);
				if (resp.id) {
					// console.log('go to user')
					window.location.href = "/user";
				}
				else {
					gotoAdminPanel(language);
				}

			},
			error: (resp) => {
				gotoAdminPanel(language);
			}
		});
	}

	effi.logout();
	effi.auth(opts);
}

function registerUser(opts) {
	effi.request({
		url: '/nologin/srv/Baloon/Person/Register_API',
		data: serializeAURL(opts.data),
		success: (resp) => {
			console.log(resp);
			if (opts.success) opts.success(resp)
		},
		error: (resp) => {
			if (opts.error) opts.error(resp);
		}
	});
}

window.loginToPanel = loginToPanel;
window.registerUser = registerUser;
export { loginToPanel, registerUser };