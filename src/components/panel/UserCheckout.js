import React from 'react';
import { observer } from 'mobx-react';
import { appContext } from '../panel/UserApp';
import { DatePicker } from 'lib/date_picker';
import SelectField from 'lib/select-field';
import Counter from 'lib/counter';
import _ from 'lodash';

@observer
export default class Checkout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            submitEnabled: false,
            email: "",
            emailConfirm: "",
            renderEmailError: false
        }
    }

    emailChange = e => {
        const value = e.currentTarget.value;
        this.setState({email: value, renderEmailError: false}, () => {
            this.checkEnabled();
            appContext.appState.order.email = this.state.email;
        });

    }

    /*emailConfirmChange = e => {
        const value = e.currentTarget.value;
        this.setState({emailConfirm: value, renderEmailError: false}, () => {
            this.checkEnabled();
            appContext.appState.order.email = this.state.email;
        });

    }*/

    checkEnabled = () => {
        if (appContext.appState.order.count > 0 && appContext.appState.order.tariff != "") {
            this.setState({submitEnabled: true});
        } else {
            this.setState({submitEnabled: false});
        }
    }

    submitTicket = () => {
        if(this.state.email == this.state.emailConfirm) {
            appContext.appState.requestPlaceAPI(() => {})
        } else {
            this.setState({renderEmailError: true});
        }
    }

    goBack = () => {
        // window.location.href = "#/";
        if (this.props.goBack ) {this.props.goBack();}
    }

    render() {
        const { tariffName, day, count} = appContext.appState.order;
        let {price} = appContext.appState.order;
        //const ruleDetails = _.find(appContext.appState.rules, function(o) { return o.name == rule.text; });
        //console.log(appContext.appState.order);
        price = (count || 0)*price.toFixed(2);
        //if (ruleDetails) {
        //}

        let note = null;
        if (this.state.renderEmailError) {
            note = (<p className="email-note">Адреса электронной почты не совпадают.</p>)
        }

        return(

            <div className="shop-layout">
                <h1>ПОКУПКА БИЛЕТА</h1>
                <button className="back-button" onClick={this.goBack}>Назад</button>

                <div className="order-positions">
                    <table>
                        <tr>
                            <th>Тип дня</th>
                            <th>Тариф</th>
                            <th>Количество</th>
                            <th>Цена</th>
                        </tr>
                        <tr>
                            <td>{day}</td>
                            <td>{tariffName}</td>
                            <td>{count}</td>
                            <td>{price} руб</td>
                        </tr>
                    </table>
                </div>
                <div className="submit-section">
                    <div className="total-price">
                        <h1>{price} руб </h1>
                    </div>
                    <button disabled={false} className={"purchase-button "} onClick={this.submitTicket}>
                        Оплатить
                    </button>
                </div>

            </div>
        )
    }
}