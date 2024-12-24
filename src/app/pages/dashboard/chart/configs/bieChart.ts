import { ApexOptions } from 'apexcharts';

const bieChartDanToc = {
    series: [90, 10, 5],

    options: {
      chart: {
        type: 'donut' as ApexOptions['chart'],
        width: 380,
      },
      labels: ['Kinh', 'Tày', 'Mông'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        y: {
          formatter: function (val: number) {
            return `${val}`;
          },
        },
      },
    } as ApexOptions, // Explicitly cast options to ApexOptions
  };

  
const bieChartTonGiao = {
    series: [85, 6, 9],

    options: {
      chart: {
        type: 'donut' as ApexOptions['chart'],
        width: 380,
      },
      labels: ['Không có', 'Phật giáo', 'Công giáo'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        y: {
          formatter: function (val: number) {
            return `${val}`;
          },
        },
      },
    } as ApexOptions, // Explicitly cast options to ApexOptions
  };


  export {bieChartDanToc, bieChartTonGiao}
  