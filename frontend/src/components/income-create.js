import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class IncomeCreate {
    constructor() {
        this.createIncomeData();
    }

    // Создаем новый доход
    createIncomeData() {
        const incomeCreateInput = document.getElementById('incomeCreateInput');
        const incomeCreateAgreeButton = document.getElementById('incomeCreateAgree');
        const incomeCreateCancelButton = document.getElementById('incomeCreateCancel');
        let errorMessage = document.getElementById('error-message');

        incomeCreateAgreeButton.onclick = async (e) => {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                    title: incomeCreateInput.value
                });

                console.log(result)

                if (result) {
                    if (result.error || result.message) {
                        errorMessage.style.display  = 'flex';
                        console.log('123', 'Уже есть, или пусто. Не могу применить стили для сообщения ошибки')
                    } else {
                        // Добавляем доход
                        location.href = '#/income';
                    }
                } else {
                    throw new Error(result.message);
                }
            } catch (e) {
                return console.log(e);
            }
        }

        incomeCreateCancelButton.onclick = () => {
            location.href = '#/income';
        }
    }
}
