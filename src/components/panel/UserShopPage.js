import React from 'react';
import { observer } from 'mobx-react';
//import { DatePicker } from './lib/date_picker.js';
import SelectField from 'lib/select-field';
import Counter from 'lib/counter';
import Checkout from './UserCheckout';
//import { toJS } from 'mobx';
import { muiTheme, appContext } from './UserApp';
import UserLayout from './UserLayout';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { RaisedButton, Paper, Divider, TextField, MenuItem, Snackbar, DatePicker} from 'material-ui';
import 'stylesheets/tickets-shop.less'

@observer
export default class ShopPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "shop",
            date: new Date(),
            count: 1,
            tariff: {
                id: 0,
                text: '',
                price: 0
            },
            day: '',
            tariffs: [],
            days: []
            //rules: []
        }
    }

    changeCount = (count) => {
        this.setState({count: count});
    }

    setDate = (date) => {
        this.setState({date: date});
    }

    setTariff = (tariff) => {
        console.log(tariff);
        this.setState({tariff: tariff});
    }
    setDay = (day) => {
        appContext.appState.requestServiceTariffs((day),(data) => {
            if (data.length <= 0) return;
            let tariffs = this.parseTariffs(data);
            this.setState({tariffs: tariffs, tariff: tariffs[0], day: day});
        })

    }

    submitTicket = () =>{
        appContext.appState.order = {
            count: this.state.count,
            tariffName: this.state.tariff.text,
            day: this.state.day.text,
            price: this.state.tariff.price,
            id: this.state.tariff.id
        }
        this.setState({page: "checkout"})
        // appContext.appState.openCheckout();

    }

    setShop = () => {
        this.setState({page: "shop"});
    }

    componentDidMount() {
        appContext.appState.requestServiceDays((data) => {
            if (data.length <= 0) return;
            let days = [];
            for(let i = 0; i< data.length; i++){
                days[i] = {};
                days[i]['id'] = i;
                days[i]['text'] = data[i]['groupname'];
            }
            this.setState({days: days, day: days[0]});
            appContext.appState.requestServiceTariffs((this.state.day),(data) => {
                if (data.length <= 0) return;
                let tariffs = this.parseTariffs(data);
                this.setState({tariffs: tariffs, tariff: tariffs[0]});
            })
        })
        //console.log(this.state.days);

    }

    parseTariffs = (data) => {
        let tariffs = [];
        for(let i=0;i< data.length; i++) {
         //   if (data[i]['name'].indexOf(day['text'].toLowerCase()) !== -1) {
                tariffs[i] = {};
                tariffs[i]['text'] = data[i]['name'];
                tariffs[i]['id'] = data[i]['id'];
                tariffs[i]['price'] = data[i]['price'];
          //  }
        }
        return tariffs;
    }


    render() {

        const costs = appContext.appState.costs;
        const { tariffs } = this.state;
        const { days } = this.state;
        // console.log(days);
        /*{costs.map((item, i) => {
                            return(<li key={i}>Цена за проезд {item.name} - {item.price} руб. в будни и {item.price} руб. в выходные</li>);
                        })}*/
        const shop = (
            <div>
                <h1>ПОКУПКА БИЛЕТА</h1>
                <div className="ticket-settings">
                    <div className="ticket-rule">
                        <h2>Выберите тип дня</h2>
                        {
                            days.length == 0 ? (<div></div>) : (<SelectField options={days} selectOption={this.setDay}/>)
                        }
                    </div>
                    <div className="ticket-rule">
                        <h2>Выберите тариф</h2>
                        {
                            tariffs.length == 0 ? (<div></div>) : (<SelectField options={tariffs} selectOption={this.setTariff}/>)
                        }
                    </div>
                    <div className="ticket-count">
                        <h2>Выберите кол-во проходов</h2>
                        <Counter initValue={1} onChange={this.changeCount} maxValue={50}/>
                    </div>
                </div>
                <div className="costs-label">

                </div>
                <div className="submit-section">
                    <button className="purchase-button" onClick={this.submitTicket}>
                        Купить
                    </button>
                </div>
            </div>
        )

        const checkout = (
            <Checkout goBack={this.setShop} />
        )
        return(
            <div className="shop-layout">
                <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
                    <UserLayout selected="profile" linksid={this.props.linksid}>
                        {this.state.page == "shop" ? shop : (<div></div>)}
                        {this.state.page == "checkout" ? checkout : (<div></div>)}
                    </UserLayout>
                </MuiThemeProvider>
            </div>
        )
    }
}