import { useEffect } from 'react'
import { ILayout, useLayout } from '../../core'
import { API_URL } from '@/utils/baseAPI'
import { HelpDrawer } from '@/_metronic/partials/layout/help-drawer/HelpDrawer'

const Footer = () => {
  const { config } = useLayout()
  useEffect(() => {
    updateDOM(config)
  }, [config])
  return (
    <>
      <div className='text-gray-900 order-2 order-md-1'>
        <span className='text-muted fw-semibold me-1'>
          {new Date().getFullYear().toString()}&copy;
        </span>
        <a
          href={API_URL}
          target='_blank'
          className='text-gray-800 text-hover-primary'
        >
          Phần mềm quản lý khu công nghiệp
        </a>
      </div>

      <ul className='menu menu-gray-600 menu-hover-primary fw-semibold order-1'>
        <li className='menu-item'>
          <span
            id='kt_help_toggle'
            className='engage-help-toggle menu-link px-2'
            title='Hướng dẫn sử dụng phần mềm'
            data-bs-toggle='tooltip'
            data-bs-placement='left'
            data-bs-dismiss='click'
            data-bs-trigger='hover'
          >
            Hướng dẫn
          </span>
        </li>
      </ul>

      <HelpDrawer />
    </>
  )
}

const updateDOM = (config: ILayout) => {
  if (config.app?.footer?.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed', 'true')
  }

  if (config.app?.footer?.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile', 'true')
  }
}

export { Footer }
