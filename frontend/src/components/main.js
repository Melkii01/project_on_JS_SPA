import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from 'air-datepicker';
import {ChartPie} from "../utils/chart-pie.js";

export class Main {
    todayDate = new Date().toLocaleDateString().split('.');
    todayDateRevers = this.todayDate[2] + '-' + this.todayDate[1] + '-' + this.todayDate[0];

    constructor() {
        const btnBlock = document.querySelectorAll('.btn-outline-secondary');
        const showAll = document.getElementById('showAll');

        // Показывает изначально все операции
        btnBlock.forEach((item) => {
            item.classList.remove('active');
        })
        this.getOperationsData('all');
        showAll.classList.add('active');

        // Кнопки выбора времени показа операций
        // На каждую кнопку навешиваем клик для показа периода
        let arrPeriod = ['intervalToday', 'week', 'month', 'year', 'all'];
        btnBlock.forEach((item,i) => {
            item.onclick = () => {
                btnBlock.forEach((i) => i.classList.remove('active')
                )
                this.getOperationsData(arrPeriod[i]);
                item.classList.add('active');
            }
        })

        // Показ по интервалу
        const showInterval = document.getElementById('showInterval');
        const startDateLabel = document.getElementById('startDateLabel');
        const endDateLabel = document.getElementById('endDateLabel');

        let startDateValue;
        new AirDatepicker('#startDate', {
            onSelect: function ({formattedDate}) {
                startDateLabel.innerText = 'Дата';
                showInterval.setAttribute('disabled', 'disabled');
                if (formattedDate) {
                    startDateLabel.innerText = formattedDate;
                    if (endDateValue) {
                        showInterval.removeAttribute('disabled');
                    }
                }
                startDateValue = formattedDate;
            },
            autoClose: true
        });

        let endDateValue;
        new AirDatepicker('#endDate', {
            onSelect: function ({formattedDate}) {
                endDateLabel.innerText = 'Дата';
                showInterval.setAttribute('disabled', 'disabled');
                if (formattedDate) {
                    endDateLabel.innerText = formattedDate;
                    if (startDateValue) {
                        showInterval.removeAttribute('disabled');
                    }
                }
                endDateValue = formattedDate;
            },
            autoClose: true
        });

        showInterval.onclick = () => {
            if (startDateValue && endDateValue) {
                let startDateValueData = startDateValue.split('.');
                let startDateValueRevert = startDateValueData[2] + '-' + startDateValueData[1] + '-' + startDateValueData[0];

                let endDateValueData = endDateValue.split('.');
                let endDateValueRevert = endDateValueData[2] + '-' + endDateValueData[1] + '-' + endDateValueData[0];

                btnBlock.forEach((item) => {
                    item.classList.remove('active');
                })
                this.getOperationsData('interval', startDateValueRevert, endDateValueRevert);
                showInterval.classList.add('active');
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
