import { ApexOptions } from 'apexcharts';

const hoiCCBChart = {
  series: [
    {
      name: 'Số lượng',
      data: [4, 1, 10],
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
    },
    grid: {
      show: true,
      strokeDashArray: 2,
    },
    xaxis: {
      categories: ['Hội CCB cấp cơ sở', 'Chi hội cơ sở', 'Chi hội trực thuộc'],
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
    colors: ['#FF5733', '#33FF57', '#3357FF'],  // Customize the colors of the bars
  } as ApexOptions,
};

export { hoiCCBChart };
