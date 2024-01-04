import {Chart} from "chart.js/auto";

export class ChartPie {
    // Параметры первого пирога
    partsPie1 = [111, 222, 333, 444, 555];
    labels1 = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
    labelsColor1 = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'];

    // Параметры второго пирога
        partsPie2 = [411, 222, 333, 444, 155];
    labels2 = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
    labelsColor2 = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'];

    constructor() {
        this.myChart1();
        this.myChart2();
    }

    myChart1() {
        const ctx = document.getElementById('myChart1');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.labels1,
                datasets: [
                    {
                        label: 'Доход',
                        data: this.partsPie1,
                        backgroundColor: this.labelsColor1,
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

    myChart2() {
        const ctx = document.getElementById('myChart2');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.labels2,
                datasets: [
                    {
                        label: 'Расход',
                        data: this.partsPie2,
                        backgroundColor: this.labelsColor2,
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
