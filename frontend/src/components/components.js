import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from 'air-datepicker';
import {ChartPie} from "../utils/chart-pie.js";

export class Components {
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
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');

        let startDateValue;
        startDate.addEventListener('click', () => {
            new AirDatepicker('#startDate', {
                onSelect: function ({ formattedDate}) {
                    startDate.innerText = formattedDate;
                    startDateValue = formattedDate;
                    console.log(startDateValue)
                }
            });
        }, {once: true});
        // При клике несколько раз, заново открывает календарь, и не дает выбрать месяцы и годы.
        // Точнее новый календарь перекрывает первого. И так идет цикл
        // Надо понять как вызвать календарь по нажатию на див в самом календаре

        let endDateValue;
        endDate.addEventListener('click', () => {
            new AirDatepicker('#endDate', {

                onSelect: function ({ formattedDate}) {
                    endDate.innerText = formattedDate;
                    endDateValue = formattedDate;
                    console.log(endDateValue)
                }
            });
        }, {once: true});
        // При клике несколько раз, заново открывает календарь, и не дает выбрать месяцы и годы.
        // Точнее новый календарь перекрывает первого. И так идет цикл
        // Надо понять как вызвать календарь по нажатию на див в самом календаре

        showInterval.onclick = () => {
            console.log('show')
            console.log(startDateValue)
            console.log(endDateValue)
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
                    // console.log(result);
                }
            } else {
                throw new Error(result.message);
            }

        } catch (e) {
            return console.log(e);
        }
    }
}
