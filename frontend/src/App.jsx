import React from 'react';
import { Outlet } from 'react-router-dom';
import Side from './components/Side';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1">
        
        <div className="fixed top-[64px] sm:w-[250px] border-r-2 bg-white ">
          <Side />
        </div>

        
        <main className="flex-1 pt-[64px] sm:ml-[250px] p-4 bg-gray-100 min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
