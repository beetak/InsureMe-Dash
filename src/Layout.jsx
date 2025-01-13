import { Outlet } from 'react-router-dom';

const Layout = () => {

  return(
    <div className='flex'>
      <Outlet/>
    </div>
  )
};

export default Layout;