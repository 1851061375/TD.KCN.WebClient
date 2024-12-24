import { ApexOptions } from 'apexcharts';

const eChart = {
  series: [
    {
      name: 'Kế hoạch',
      data: [3, 4, 1, 5, 10, 8,10,11,3,20,2, 16],
      color: '#fff',
    },
  ],

  options: {
    chart: {
      type: 'bar' as ApexOptions['chart'],
      width: '100%',
      height: 'auto',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    grid: {
      show: true,
      borderColor: '#ccc',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: Array(12).fill('#fff'), // Simplified array creation
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: Array(12).fill('#fff'),
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
  } as ApexOptions,
};

export { eChart };
