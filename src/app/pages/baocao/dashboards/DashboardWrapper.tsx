import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
// import { CardsWidget20, StatisticsWidget1 } from '@/_metronic/partials/widgets'
import { PageTitle } from '@/_metronic/layout/core/PageData'
import { Content } from '@/_metronic/layout/components/content'
import { MainWidget, ToDoCard, ReportCard } from './components'
import { TrangThaiBaoCaoEnum } from '@/models'
import { DefaultOptionType } from 'antd/lib/select'
import { Form, FormInstance } from 'antd'

export interface IReportFilter {
  loaiBaoCaoId: string | null;
  trangThaiBaoCao: TrangThaiBaoCaoEnum | null;
  namBaoCao?: number | null;
  kyBaoCaoId?: string | null;
  soKyBaoCaoId?: string | null;
  soKyBaoCao?: DefaultOptionType | null;
  keyword?: string | null;
}



interface DashboardPageProps {
  form: FormInstance<IReportFilter>;
  reportFilter: IReportFilter;
  setReportFilter: React.Dispatch<React.SetStateAction<IReportFilter>>;
}

const DashboardPage: FC<DashboardPageProps> = ({ form, reportFilter, setReportFilter }) => (

  <>
    <Content>
      <div className='row gy-5 g-xl-8'>
        <div className='col-xxl-4'>
          <ToDoCard
            form={form}
            setReportFilter={setReportFilter}
            className='card-xxl-stretch'
          />
        </div>
        <div className='col-xxl-8'>
          <MainWidget
            className='card-xxl-stretch mb-xl-8'
            chartColor='primary'
            chartHeight='120px'
            strokeColor='white'
          />
        </div>

      </div>

      {/* begin::Row */}
      <div className='row gy-3 gx-xl-5'>
        <ReportCard
          form={form}
          className='card-xxl-stretch mb-3 mb-xxl-5 '
          reportFilter={reportFilter}
          setReportFilter={setReportFilter}
        />
      </div>
      {/* end::Row */}
    </Content>

  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const [form] = Form.useForm<IReportFilter>();
  const [reportFilter, setReportFilter] = useState<IReportFilter>({
    loaiBaoCaoId: null,
    trangThaiBaoCao: null,
    namBaoCao: null,
    kyBaoCaoId: null,
    soKyBaoCaoId: null,
  });
  return (
    <>
      <PageTitle breadcrumbs={[]}>Dashboard</PageTitle>
      <DashboardPage
        form={form}
        reportFilter={reportFilter}
        setReportFilter={setReportFilter} />
    </>
  )
}

export default DashboardWrapper