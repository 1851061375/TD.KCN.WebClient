import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { Widget1 } from './Widget/Widget1'
import { Widget2 } from './Widget/Widget2'
import WidgetTop from './Widget/WidgetTop'


const DashboardPage: FC = () => (
  <>
    <WidgetTop />
    <Content>
      <Widget1 />
      <Widget2 />
    </Content>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
