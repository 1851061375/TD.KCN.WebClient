import { FC } from 'react'
import { KTIcon } from '@/_metronic/helpers'

type Props = {
  className: string
  chartColor: string
  strokeColor: string
  chartHeight: string
}

const MainWidget: FC<Props> = ({ className }) => {
  const cards = [
    {
      id: 1,
      bgColor: 'bg-light-primary',
      iconName: 'graph-2',
      textColor: 'text-primary',
      value: '10',
      total: '13',
      label: 'Tổng số báo cáo',
      link: '#',
    },
    {
      id: 2,
      bgColor: 'bg-light-success',
      iconName: 'people',
      textColor: 'text-success',
      value: '2',
      total: '4',
      label: 'Báo cáo lao động',
      link: '#',
    },
    {
      id: 3,
      bgColor: 'bg-light-warning',
      iconName: 'bank',
      textColor: 'text-warning',
      value: '3',
      total: '4',
      label: 'Báo cáo đầu tư',
      link: '#',
    },
    {
      id: 4,
      bgColor: 'bg-light-warning',
      iconName: 'element-8',
      textColor: 'text-warning',
      value: '3',
      total: '4',
      label: 'Báo cáo doanh nghiệp',
      link: '#',
    },
    {
      id: 5,
      bgColor: 'bg-light-info',
      iconName: 'night-day',
      textColor: 'text-info',
      value: '3',
      total: '4',
      label: 'Báo cáo tài nguyên, môi trường',
      link: '#',
    },
    {
      id: 6,
      bgColor: 'bg-light-danger',
      iconName: 'call',
      textColor: 'text-danger',
      value: '5',
      total: '5',
      label: 'Báo cáo PCCC và ANTT',
      link: '#',
    },

  ]

  return (
    <div className={`card ${className}`}>
      <div className='card-body p-0'>
        <div className='card-p position-relative row card-custom-padding'>
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`col col-4 g-0 ${index < cards.length - 3 ? 'mb-4' : ''}`}
            >
              <div className={` ${card.bgColor} px-6 py-8 rounded-2 mx-3`}>
                <div className='d-flex justify-content-between align-items-center'>
                  <KTIcon iconName={card.iconName} className={`fs-3x ${card.textColor} d-block my-2`} />
                  <div>
                    <span className='fw-bold fs-2 text-gray-600'>{card.value}</span>
                    <span className={`fw-bolder fs-2x ${card.textColor}`}>/{card.total}</span>
                  </div>
                </div>
                <a href={card.link} className={`${card.textColor} fw-semibold fs-6`}>
                  {card.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { MainWidget }
