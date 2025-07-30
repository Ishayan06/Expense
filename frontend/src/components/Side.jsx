import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

function Side() {
  return (
    <div className='w-[250px] hidden sm:block h-full border-r-2 bg-white'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            `${isActive ? 'text-white bg-purple-600' : 'text-gray-700'} 
            flex items-center gap-2 border border-gray-300 border-r-0 px-3 py-2 rounded-lg`
          }
        >
          <img className='w-5' src={assets.dashboard} alt="Dashboard" />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>

        <NavLink
          to="/app/credit"
          className={({ isActive }) =>
            `${isActive ? 'text-white bg-purple-600' : 'text-gray-700'} 
            flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg`
          }
        >
          <img className='w-5' src={assets.profit} alt="Credit" />
          <p className='hidden md:block'>Total Credit</p>
        </NavLink>

        <NavLink
          to="/app/debit"
          className={({ isActive }) =>
            `${isActive ? 'text-white bg-purple-600' : 'text-gray-700'} 
            flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg`
          }
        >
          <img className='w-5' src={assets.spending} alt="Debit" />
          <p className='hidden md:block'>Total Debit</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Side;
