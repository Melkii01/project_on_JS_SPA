import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class IncomeEdit {
    constructor(itemId) {

        this.incomeId = itemId;
        this.getIncomeEditData();

    }

    async getIncomeEditData() {
        const incomeEditInput = document.getElementById('incomeEditInput');
        console.log(incomeEditInput)
        const incomeEditAgreeButton = document.getElementById('incomeEditAgreeButton');
        const incomeEditCancelButton = document.getElementById('incomeEditCancelButton');

        try {

            const result = await CustomHttp.request(config.host + '/categories/income/' + this.incomeId);
            console.log(result.title)
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Заменяем баланс
                    incomeEditInput.value = result.title;
                    return
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }
}
