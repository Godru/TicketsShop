import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { appContext, muiTheme } from './UserApp';
import UserLayout from './UserLayout';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { RaisedButton, Paper, Divider, TextField, SelectField, MenuItem, DatePicker, Snackbar } from 'material-ui';

@observer
export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showPasswordForm: false,
			showProfileForm: false,
			profileForm: {},
			passwordForm: {},
			updated: false
		}
	}

	togglePasswordChange = () => {
		this.setState({showPasswordForm: !this.state.showPasswordForm});
	}

	toggleProfileChange = () => {
		this.setState({showProfileForm: !this.state.showProfileForm});
	}

	componentDidMount() {
		appContext.appState.requestCurrentPerson((person) => {
			this.setState({
				profileForm: {
					first_name: person.first_name,
					last_name: person.last_name,
					middle_name: person.middle_name,
					email: person.email,
					birthdate: person.birthdate,
					gender: person.gender,
					phone: person.phone
				},
				passwordForm: {
					old_password: "",
					password: "",
					password2: ""
				}
			}, () => {this.forceUpdate()})
		});
	}

	genderChange = (p1, p2, value) => {
		this.setState({
			profileForm: {
				...this.state.profileForm,
				gender: value,
			}
		});
	}

	handleProfileUpdate = () => {
		let data = appContext.appState.buildAURL(this.state.profileForm);
		appContext.appState.updateProfile(data, () => {
			this.toggleProfileChange();
			appContext.appState.requestCurrentPerson(() => {
				this.forceUpdate();
				this.showUpdated();
			});
		});
	}

	handlePasswordChange = () => {
		let data = appContext.appState.buildAURL(this.state.passwordForm);
		appContext.appState.changePassword(data, () => {
			this.togglePasswordChange();
		});
	}

	showUpdated = () => {
		this.setState({updated: true});
	}

	hideUpdated = () => {
		this.setState({updated: false});
	}

	setProfileField = (key, value) => {
		this.setState({profileForm: {
			...this.state.profileForm,
			[key]: value,
		}})
	}

	setPasswordField = (key, value) => {
		this.setState({passwordForm: {
			...this.state.passwordForm,
			[key]: value,
		}})
	}

	render() {

		let profile = (
			<div className="profile">
				<div className="profile-header">
					<h2>Личная информация</h2>
				</div>
				<Divider/>
				<div className="profile-line">
					<label>ФИО</label>
					<div>
						<span className="last_name">{appContext.appState.person.last_name} </span>
						<span className="first_name">{appContext.appState.person.first_name} </span>
						<span className="middle_name">{appContext.appState.person.middle_name}</span>
					</div>
				</div>
				<Divider/>
				<div className="profile-line">
					<label>Email</label>
					<div>
						<span>{appContext.appState.person.email}</span>
					</div>
				</div>
				<Divider/>
				<div className="profile-line">
					<label>Дата рождения</label>
					<div>
						<span>{appContext.appState.getLocaleDate(appContext.appState.person.birthdate)}</span>
					</div>
				</div>
				<Divider/>
				<div className="profile-line">
					<label>Пол</label>
					<div>
						<span>{appContext.appState.getLocaleGender(appContext.appState.person.gender)}</span>
					</div>
				</div>
				<Divider/>
				<div className="profile-line">
					<label>Телефон</label>
					<div>
						<span>{appContext.appState.person.phone}</span>
					</div>
				</div>
				<Divider/>
				<div className="profile-line">
					<RaisedButton className="single-button" onClick={this.toggleProfileChange}>Изменить личные данные</RaisedButton>
				</div>
				<Divider/>
			</div>
		);

		if(this.state.showProfileForm) {
			profile = (
				<div className="profile-form">
					<div className="profile-header">
						<h2>Личная информация</h2>
					</div>
					<Divider/>
					<div className="profile-line">
						<label>Фамилия</label>
						<div>
							<div><TextField defaultValue={appContext.appState.person.last_name} hintText="Введите Фамилию" 
								className="profile-text-field" name="last_name" onChange={(p1, val) => {this.setProfileField("last_name", val)}}/></div>
						</div>
					</div>
					<Divider/>
					<div className="profile-line">
						<label>Имя</label>
						<div>
							<div><TextField defaultValue={appContext.appState.person.first_name} hintText="Введите Имя" 
								className="profile-text-field" name="first_name" onChange={(p1, val) => {this.setProfileField("first_name", val)}}/></div>
						</div>
					</div>
					<Divider/>
					<div className="profile-line">
						<label>Отчество</label>
						<div>
							<div><TextField defaultValue={appContext.appState.person.middle_name} hintText="Введите Отчество" 
								className="profile-text-field" name="middle_name" onChange={(p1, val) => {this.setProfileField("middle_name", val)}}/></div>
						</div>
					</div>
					<Divider/>
					{/*<div className="profile-line">
											<label>Email</label>
											<div>
												<div><TextField defaultValue={appContext.appState.person.email} hintText="Введите email" 
													className="profile-text-field" name="email" onChange={(p1, val) => {this.setProfileField("email", val)}}/></div>
											</div>
										</div>
					<Divider/>*/}
					<div className="profile-line">
						<label>Дата рождения</label>
						<div>
							<div>
								<DatePicker hintText="Выберите дату рождения" className="profile-text-field" container="inline" 
									name="birthdate" onChange={(p1, val) => {this.setProfileField("birthdate", val)}}/>
							</div>
						</div>
					</div>
					<Divider/>
					<div className="profile-line">
						<label>Пол</label>
						<div>
							<div>
								<SelectField className="profile-text-field" name="gender" hintText="Выберите из списка"
									value={this.state.profileForm.gender} onChange={this.genderChange}>
									<MenuItem value={"man"} primaryText={appContext.appState.getLocaleGender("man")} />
									<MenuItem value={"lady"} primaryText={appContext.appState.getLocaleGender("lady")} />
								</SelectField>
							</div>
						</div>
					</div>
					<Divider/>
					<div className="profile-line">
						<label>Телефон</label>
						<div>
							<div><TextField  defaultValue={appContext.appState.person.phone} hintText="Введите номер телефона" 
								className="profile-text-field" name="phone" onChange={(p1, val) => {this.setProfileField("phone", val)}}/></div>
						</div>
					</div>
					<Divider/>
					<div className="profile-line">
						<RaisedButton onClick={this.handleProfileUpdate}>Подтвердить</RaisedButton>
						<RaisedButton onClick={this.toggleProfileChange}>Отмена</RaisedButton>
					</div>
					<Divider/>
				</div>
			);
		}

		let password = (
			<div className="profile-line">
				<label>Пароль</label>
				<div>
					<RaisedButton onClick={this.togglePasswordChange}>Изменить</RaisedButton>
				</div>
			</div>
		);

		if(this.state.showPasswordForm) {
			password = (
				<div className="profile-form">
					<div className="profile-line">
						<label>Старый пароль</label>
						<div><TextField hintText="Введите пароль" type="password" className="profile-text-field" name="old_password"
							 onChange={(p1, val) => {this.setPasswordField("old_password", val)}} /></div>
					</div>
					<div className="profile-line">
						<label>Новый пароль</label>
						<div><TextField hintText="Введите пароль" type="password" className="profile-text-field" name="password"
							onChange={(p1, val) => {this.setPasswordField("password", val)}} /></div>
					</div>
					<div className="profile-line">
						<label>Повторите пароль</label>
						<div><TextField hintText="Введите пароль" type="password" className="profile-text-field" name="password2"
							onChange={(p1, val) => {this.setPasswordField("password2", val)}} /></div>
					</div>
					<div className="profile-line">
						<RaisedButton onClick={this.handlePasswordChange}>Подтвердить</RaisedButton>
						<RaisedButton onClick={this.togglePasswordChange}>Отмена</RaisedButton>
					</div>
				</div>
			);
		}
		return (
			<div className="profile">
			<MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
			<UserLayout selected="profile" linksid={this.props.linksid}>
				<Paper zDepth={1} className="profile-paper">
					{profile}
					{password}
					<Snackbar
						open={this.state.updated}
						message="Личные данные обновлены"
						autoHideDuration={4000}
						onRequestClose={this.hideUpdated}
					/>
				</Paper>
			</UserLayout>
			</MuiThemeProvider>
			</div>
		);
	}
}
