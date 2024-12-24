import clsx from 'clsx'
import { KTIcon } from '../../../helpers'
import { ThemeModeComponent } from '../../../assets/ts/layout'
import { ThemeModeType, useThemeMode } from './ThemeModeProvider'


type Props = {
  toggleBtnClass?: string
  toggleBtnIconClass?: string
  menuPlacement?: string
  menuTrigger?: string
}

const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark'

const ThemeModeSwitcher = ({
  toggleBtnClass = '',
  toggleBtnIconClass = 'fs-1',
  menuPlacement = 'bottom-end',
  menuTrigger = "{default: 'click', lg: 'hover'}",
}: Props) => {
  const { mode, menuMode, updateMode, updateMenuMode } = useThemeMode()
  const calculatedMode = mode === 'system' ? systemMode : mode
  const switchMode = (_mode: ThemeModeType) => {
    updateMenuMode(_mode)
    updateMode(_mode)
  }

  return (
    <>
      {/* begin::Menu toggle */}
      <div
        className='menu-item px-5'
        data-kt-menu-trigger='hover'
        data-kt-menu-placement='left-start'
        data-kt-menu-flip='bottom'
      >
        <a href='#' className='menu-link px-5' data-kt-menu-trigger={menuTrigger}
          data-kt-menu-attach='parent'
          data-kt-menu-placement={menuPlacement}>
          <span className='menu-title position-relative'>
            Giao diện
            {calculatedMode === 'light' ? (
              <span className='d-flex fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
                <span className='menu-title'>Sáng</span>
                <KTIcon iconName='night-day' className={clsx('theme-light-hide', toggleBtnIconClass)} />
              </span>
            ) : calculatedMode === 'dark' ? (
              <span className='d-flex fs-8 rounded bg-dark px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
                <span className='menu-title'>Tối</span>
                <KTIcon iconName='moon' className={clsx('theme-dark-hide', toggleBtnIconClass)} />
              </span>
            ) : (
              <span className='d-flex fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
                <span className='menu-title'>Mặc định</span>
                <KTIcon iconName='screen' className={clsx('theme-dark-hide', toggleBtnIconClass)} />
              </span>
            )}
          </span>
        </a>
      </div>
      {/* begin::Menu toggle */}

      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-175px'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3 my-0'>
          <a
            href='#'
            className={clsx('menu-link px-3 py-2', { active: menuMode === 'light' })}
            onClick={() => switchMode('light')}
          >
            <span className='menu-icon' data-kt-element='icon'>
              <KTIcon iconName='night-day' className='fs-1' />
            </span>
            <span className='menu-title'>Sáng</span>
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3 my-0'>
          <a
            href='#'
            className={clsx('menu-link px-3 py-2', { active: menuMode === 'dark' })}
            onClick={() => switchMode('dark')}
          >
            <span className='menu-icon' data-kt-element='icon'>
              <KTIcon iconName='moon' className='fs-1' />
            </span>
            <span className='menu-title'>Tối</span>
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3 my-0'>
          <a
            href='#'
            className={clsx('menu-link px-3 py-2', { active: menuMode === 'system' })}
            onClick={() => switchMode('system')}
          >
            <span className='menu-icon' data-kt-element='icon'>
              <KTIcon iconName='screen' className='fs-1' />
            </span>
            <span className='menu-title'>Mặc định</span>
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  )
}

export { ThemeModeSwitcher }
