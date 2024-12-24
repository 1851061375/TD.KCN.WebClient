
import React, { useEffect } from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
      {/* begin::Body */}
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

        {/* begin::Footer */}
        <div className='d-flex flex-center flex-wrap px-5'>
          {/* begin::Links */}
          {/* <div className='d-flex fw-semibold text-primary fs-base'>
            <a href='#' className='px-5' target='_blank'>
              Terms
            </a>

            <a href='#' className='px-5' target='_blank'>
              Plans
            </a>

            <a href='#' className='px-5' target='_blank'>
              Contact Us
            </a>
          </div> */}
          {/* end::Links */}
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
        style={{backgroundImage: `url(${toAbsoluteUrl('media/misc/auth-bg.png')})`}}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
          {/* begin::Logo */}
          <Link to='/' className='mb-12'>
            {/* <img alt='Logo' src={toAbsoluteUrl('media/logos/custom-1.png')} className='h-75px' /> */}
          </Link>
          {/* end::Logo */}

          {/* begin::Image */}
          <img
            className='mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20'
            src={toAbsoluteUrl('media/misc/auth-screens.png')}
            alt=''
          />
          {/* end::Image */}

          {/* begin::Title */}
          {/* <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
            Fast, Efficient and Productive
          </h1> */}
          {/* end::Title */}

          {/* begin::Text */}
          {/* <div className='text-white fs-base text-center'>
            In this kind of post,{' '}
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
              the blogger
            </a>
            introduces a person they’ve interviewed <br /> and provides some background information
            about
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
              the interviewee
            </a>
            and their <br /> work following this is a transcript of the interview.
          </div> */}
          {/* end::Text */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}
    </div>

    // <React.Fragment>
    //   {/* begin::Background Image */}
    //   <div
    //     className='bg-white bgi-no-repeat bgi-position-center'
    //     style={{
    //       backgroundImage: `url(${toAbsoluteUrl('media/images/bg-login.png')})`,
    //       backgroundAttachment: 'fixed',  // Hình nền cố định khi cuộn trang
    //       backgroundSize: 'cover',        // Phóng to hình nền để phủ toàn bộ phần tử, giữ tỷ lệ
    //       backgroundPosition: 'center',   // Căn giữa hình ảnh
    //       backgroundRepeat: 'no-repeat',  // Không lặp lại hình ảnh
    //       height: '100vh',                // Chiều cao của phần tử
    //       width: '100vw',                 // Chiều rộng của phần tử
    //       position: 'fixed',              // Gắn cố định
    //       zIndex: '-1',                   // Đảm bảo hình ảnh nền luôn ở phía dưới các phần tử khác
    //     }}
    //   >

    //   </div>
    //   {/* end::Background Image */}
    //   {/* begin::Main content */}
    //   <div
    //     className='d-flex flex-column flex-column-fluid h-100'
    //   >
    //     {/* begin::Header */}
    //     <div
    //       className='d-flex align-items-center z-index-2 header-responsive'
    //       style={{
    //         width: '100%',
    //         height: 'fit-content',
    //         position: 'absolute',
    //       }}
    //     >
          
    //     </div>
    //     {/* end::Header */}
    //     {/* begin::Body */}
    //     <div
    //       className='d-flex flex-column flex-center'
    //       style={{
    //         height: '100vh', // Chiếm toàn bộ chiều cao của viewport
    //         paddingTop: '0', // Bạn có thể điều chỉnh lại padding nếu cần
    //         display: 'flex', // Đảm bảo sử dụng flexbox
    //         justifyContent: 'center', // Căn giữa theo chiều dọc
    //         alignItems: 'center', // Căn giữa theo chiều ngang
    //       }}
    //     >
    //       {/* begin::Form */}
    //       <div className='d-flex flex-center flex-column form-responsive'
    //       style={{
    //         background: '#ffffff00',
    //         padding: '20px 70px',
    //         // border: 'solid 1px lightgray',
    //         // borderRadius: '10px'
    //       }}
    //       >
    //         {/* begin::Wrapper */}
    //         {/* <div className='w-lg-500px bg-white rounded shadow'> */}
    //           <Outlet />
    //         {/* </div> */}
    //         {/* end::Wrapper */}
    //       </div>  
    //       {/* end::Form */}
    //     </div>
    //     {/* end::Body */}
    //   </div>
    //   {/* end::Main content */}
    // </React.Fragment>

  )
}

export {AuthLayout}
