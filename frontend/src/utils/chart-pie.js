import {Chart} from "chart.js/auto";
import {RandomColor} from "./randomColor.js";

export class ChartPie {
    incomeData = [];
    expenseData = [];

    constructor(data) {
        data.forEach((item) => {
            if (item.type === 'income') {
                this.incomeData.push(item);
            } else if (item.type === 'expense') {
                this.expenseData.push(item);
            }
        })
        this.myChart1(this.incomeData);
        this.myChart2(this.expenseData);
    }

    // Пирог дохода
    myChart1(data) {
        // Если на странице используется пирог, удалить его
        let chartStatus = Chart.getChart("myChart1"); // <canvas> id
        if (chartStatus !== undefined) {
            chartStatus.destroy();
        }

        // Параметры первого пирога
        let partsPie = [];
        let labels = [];
        let labelsColor = [];
        const ctx = document.getElementById('myChart1');
        const mainPageChartNoData = document.getElementById('mainPageChartNoData1');

        if (!data.length) {
            mainPageChartNoData.style.display = 'block';
        } else {
            mainPageChartNoData.style.display = 'none';

            data.forEach((item) => {
                partsPie.push(item.amount);
                labels.push(item.category);
                labelsColor.push("#" + RandomColor())
            })

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Доход',
                            data: partsPie,
                            backgroundColor: labelsColor,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true
                        }
                    }
                },
            });
        }
    }

    // Пирог расхода
    myChart2(data) {
        // Если на странице используется пирог, удалить его
        let chartStatus = Chart.getChart("myChart2"); // <canvas> id
        if (chartStatus !== undefined) {
            chartStatus.destroy();
        }

        // Параметры второго пирога
        let partsPie = [];
        let labels = [];
        let labelsColor = [];
        const ctx = document.getElementById('myChart2');
        const mainPageChartNoData = document.getElementById('mainPageChartNoData2');

        if (!data.length) {
            mainPageChartNoData.style.display = 'block';
        } else {
            mainPageChartNoData.style.display = 'none';

            data.forEach((item) => {
                partsPie.push(item.amount);
                labels.push(item.category);
                labelsColor.push("#" + RandomColor())
            })

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Расход',
                            data: partsPie,
                            backgroundColor: labelsColor,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true
                        }
                    }
                },
            });
        }
    }
}

