import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Popup} from "../utils/popup";
import {DeleteItem} from "../utils/delete-item";

export class Balance {
    constructor() {
        //  Получаем баланс
        this.getBalance();

        // Меняем баланс
        const cash = document.getElementById('cash');
        cash.onclick = (e) => {
            const popup = document.getElementById('popupCash');
            const inputCash = document.getElementById('inputCash');
            const popupAgreeButton = document.getElementById('popupCashAgreeButton');
            const popupCancelButton = document.getElementById('popupCashCancelButton');

            popup.classList.add('popup-active');

            // При подтверждении закрыть окно и отправить новое значение
            popupAgreeButton.onclick = () => {
                if (inputCash.value && inputCash.value.match(/^\d+$/)) {
                    popup.classList.remove('popup-active');
                    this.changeBalance(inputCash.value)
                }
            }

            // При отказе закрыть окно
            popupCancelButton.addEventListener('click', () => {
                popup.classList.remove('popup-active');
            })
        }
        // this.changeBalance(11)
    }

    //  Получаем баланс
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
        } catch (e) {
            return console.log(e);
        }
    }

    // Меняем баланс
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
                    // // Заменяем баланс
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
