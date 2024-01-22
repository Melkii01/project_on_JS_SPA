import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from 'air-datepicker';
import {ChartPie} from "../utils/chart-pie.js";

export class Main {
    todayDate = new Date().toLocaleDateString().split('.');
    todayDateRevers = this.todayDate[2] + '-' + this.todayDate[1] + '-' + this.todayDate[0];
    constructor() {
        // Показывает изначально все операции
        this.getOperationsData('all');

        // Кнопки выбора времени показа операций
        const showToday = document.getElementById('showToday');
        showToday.onclick = () => {
            this.getOperationsData('intervalToday');
        }
        const showWeek = document.getElementById('showWeek');
        showWeek.onclick = () => {
            this.getOperationsData('week');
        }
        const showMonth = document.getElementById('showMonth');
        showMonth.onclick = () => {
            this.getOperationsData('month');
        }
        const showYear = document.getElementById('showYear');
        showYear.onclick = () => {
            this.getOperationsData('year');
        }
        const showAll = document.getElementById('showAll');
        showAll.onclick = () => {
            this.getOperationsData('all');
        }

        // Показ по интервалу
        const showInterval = document.getElementById('showInterval');
        const startDateLabel = document.getElementById('startDateLabel');
        const endDateLabel = document.getElementById('endDateLabel');

        let startDateValue;
        new AirDatepicker('#startDate', {
            onSelect: function ({ formattedDate}) {
                startDateLabel.innerText = formattedDate;
                startDateValue = formattedDate;
            },
            autoClose:true
        });

        let endDateValue;
        new AirDatepicker('#endDate', {
            onSelect: function ({ formattedDate}) {
                endDateLabel.innerText = formattedDate;
                endDateValue = formattedDate;
            },
            autoClose:true
        });

        showInterval.onclick = () => {
            if (startDateValue && endDateValue) {
                let startDateValueData = startDateValue.split('.');
                let startDateValueRevert = startDateValueData[2] + '-' + startDateValueData[1] + '-' + startDateValueData[0];

                let endDateValueData = endDateValue.split('.');
                let endDateValueRevert = endDateValueData[2] + '-' + endDateValueData[1] + '-' + endDateValueData[0];

                this.getOperationsData('interval', startDateValueRevert, endDateValueRevert);
            }
        }
    }


    // Достаем операции по выбранному периоду
    async getOperationsData(period, startDate, endDate) {
        try {
            let result;
            if (period === 'intervalToday') {
                result = await CustomHttp.request(config.host +
                    '/operations?period=interval&dateFrom=' + this.todayDateRevers
                    + '&dateTo=' + this.todayDateRevers);
            } else if (period === 'interval') {
                result = await CustomHttp.request(config.host +
                    '/operations?period=interval&dateFrom=' + startDate
                    + '&dateTo=' + endDate);
            } else {
                result = await CustomHttp.request(config.host +
                    '/operations?period=' + period);
            }
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    // Сохраняем результат в переменную
                    new ChartPie(result);
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }
}
