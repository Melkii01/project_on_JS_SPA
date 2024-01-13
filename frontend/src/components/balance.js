import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Balance {
    constructor() {
        this.getBalance();
        // this.changeBalance(122233)
    }

    async getBalance() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    let cash = document.getElementById('cash');
                    cash.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e){
            return console.log(e);
        }
    }

    async changeBalance(money) {
        try {
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {
                "newBalance": money
            });
            console.log(result, 'new balance')

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    let cash = document.getElementById('cash');
                    cash.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }
}
