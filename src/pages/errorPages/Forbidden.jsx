import { Link, useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  // Function to handle the "Back to home" link click
  const handleBackToHomeClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <div className='h-screen w-full flex justify-center items-center bg-gray-700'>
        <div className='flex flex-col items-center space-y-8 text-white'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-9xl' style={{ fontSize: '200px' }}>403</h1>
            <p className='w-72 font-semibold text-2xl'><span className='text-4xl'>Oops!</span><br />You do not have permission to access this page</p>
          </div>
          <button className='' onClick={handleBackToHomeClick}>Go Back</button>
          <p className='text-xs'>Copyright © {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </>
  );
}