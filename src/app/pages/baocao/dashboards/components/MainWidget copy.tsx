
import { useEffect, useRef, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { Dropdown1, useThemeMode } from '@/_metronic/partials'
import { KTIcon } from '@/_metronic/helpers'
import { getCSSVariableValue } from '@/_metronic/assets/ts/_utils'

type Props = {
  className: string
  chartColor: string
  strokeColor: string
  chartHeight: string
}

const MainWidget: FC<Props> = ({ className, chartColor, chartHeight, strokeColor }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(
      chartRef.current,
      chartOptions(chartHeight, chartColor, strokeColor)
    )
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className={`card-header border-0 py-5 bg-${chartColor}`}>
        <h3 className='card-title fw-bold text-white'>Thống kê báo cáo</h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Chart */}
        <div
          ref={chartRef}
          className={`mixed-widget-2-chart card-rounded-bottom bg-${chartColor}`}
        ></div>
        {/* end::Chart */}
        {/* begin::Stats */}
        <div className='card-p mt-n20 position-relative'>
          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col bg-light-primary px-6 py-8 rounded-2 mb-7 me-7'>
              <div className='d-flex justify-content-between align-items-center'>
                <KTIcon iconName='graph-2' className='fs-3x text-primary d-block my-2' />
                <div>
                  <span className='fw-bold fs-2 text-gray-600'>10</span>
                  <span className='fw-bolder fs-2x text-primary'>/13</span>
                </div>
              </div>

              <a href='#' className='text-primary fw-semibold fs-6'>
                Tổng số báo cáo
              </a>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col bg-light-success px-6 py-8 rounded-2 mb-7'>
              <div className='d-flex justify-content-between align-items-center'>
                <KTIcon iconName='graph-2' className='fs-3x text-success d-block my-2' />
                <div>
                  <span className='fw-bold fs-2 text-gray-600'>2</span>
                  <span className='fw-bolder fs-2x text-success'>/4</span>
                </div>
              </div>

              <a href='#' className='text-success fw-semibold fs-6'>
                Báo cáo lao động
              </a>
            </div>
            {/* end::Col */}


          </div>
          {/* end::Row */}
          {/* begin::Row */}
          <div className='row g-0'>
            {/* begin::Col */}
            <div className='col bg-light-warning px-6 py-8 rounded-2 me-7'>
              <div className='d-flex justify-content-between align-items-center'>
                <KTIcon iconName='graph-2' className='fs-3x text-warning d-block my-2' />
                <div>
                  <span className='fw-bold fs-2 text-gray-600'>3</span>
                  <span className='fw-bolder fs-2x text-warning'>/4</span>
                </div>
              </div>

              <a href='#' className='text-warning fw-semibold fs-6'>
                Báo cáo đầu tư
              </a>
            </div>
            {/* end::Col */}
            {/* begin::Col */}
            <div className='col bg-light-danger px-6 py-8 rounded-2'>
              <div className='d-flex justify-content-between align-items-center'>
                <KTIcon iconName='graph-2' className='fs-3x text-danger d-block my-2' />
                <div>
                  <span className='fw-bold fs-2 text-gray-600'>5</span>
                  <span className='fw-bolder fs-2x text-danger'>/5</span>
                </div>
              </div>

              <a href='#' className='text-danger fw-semibold fs-6'>
                Báo cáo PCCC và ANTT
              </a>
            </div>
            {/* end::Col */}


          </div>
          {/* end::Row */}
        </div>
        {/* end::Stats */}
      </div>
      {/* end::Body */}
    </div>
  )
}

const chartOptions = (
  chartHeight: string,
  chartColor: string,
  strokeColor: string
): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const color = getCSSVariableValue('--bs-' + chartColor)

  return {
    series: [
      {
        name: 'Báo cáo đã nộp',
        data: [1, 2, 32, 70, 40, 40, 40, 40, 40, 40, 40, 40],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 0,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3',
        'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
        'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11',
        'Tháng 12'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    // states: {
    //   normal: {
    //     filter: {
    //       type: 'none',
    //       value: 0,
    //     },
    //   },
    //   hover: {
    //     filter: {
    //       type: 'none',
    //       value: 0,
    //     },
    //   },
    //   active: {
    //     allowMultipleDataPointsSelection: false,
    //     filter: {
    //       type: 'none',
    //       value: 0,
    //     },
    //   },
    // },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + ''
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ['transparent'],
    markers: {
      colors: [color],
      strokeColors: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export { MainWidget }
