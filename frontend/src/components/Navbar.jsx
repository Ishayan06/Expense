import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../context/ExpenseContext";
function Navbar() {
  const navigate=useNavigate();
  const [visible,setVisible]=useState(false)
  const {token,setToken}=useContext(ExpenseContext);
  const [activeTab, setActiveTab] = useState("");

  const logout=async()=>{
    setToken('')
    navigate('/')
  }
  const about=async()=>{
    setActiveTab("about");
    navigate('/app/about')
  }
  const contact=async()=>{
    setActiveTab("contact");
    navigate('/app/contact')
  }
  return (
    <div className="bg-purple-950 p-2 flex justify-between">
      <Link to="/app">
        <img  className="h-10 sm:h-14" src={assets.logo} alt="logo" />
      </Link>
      {/* <ul className="flex justify-center hidden sm:flex items-center gap-6">
        <li>
          <NavLink to="/app"end>
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">Home</p>
                <hr
                  className={`border-none h-[1.5px] w-7 bg-white transition-all duration-300 ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/about">
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">About</p>
                <hr
                  className={`border-none h-[1.5px] w-7 bg-white transition-all duration-300 ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/contact">
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">Contact</p>
                <hr
                  className={`border-none h-[1.5px] w-7 bg-white transition-all duration-300 ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </div>
            )}
          </NavLink>
        </li>
        
        
      </ul> */}
      <div className="flex gap-5 mt-3 hidden sm:flex">
  <div
    onClick={about }
    className='cursor-pointer text-lg text-white'  text-white
  >
    About
  </div>
  <div
    onClick={contact}
    className={'cursor-pointer text-lg text-white '}
  >
    Contact Us
  </div>
</div>

      <div className="flex items-center">
          <button onClick={logout} className="bg-white text-black px-3 sm:mr-5 h-8 rounded font-semibold hover:bg-purple-300">Log out</button>
      </div>
      <img onClick={()=>{setVisible(true)}} className="w-9 block  sm:hidden cursor-pointer" src={assets.menu_icon} alt="" />
      <div className={`fixed top-0 right-0 h-full bg-white z-50 transition-all duration-300 ${visible ? 'w-full' : 'w-0 overflow-hidden'}`}>

          <div className="flex flex-col  text-gray-600">
            <div onClick={()=>{setVisible(false)}} className="flex items-center gap-4 p-3">
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
              <p>Back</p>
            </div>
            <hr />
            <NavLink onClick={()=>{setVisible(false)}} className="p-3 pl-5 cursor-pointer " to='/app'>Dashboard</NavLink>
            <hr />
            <NavLink onClick={()=>{setVisible(false)}} className="p-3 pl-5 cursor-pointer " to='/app/credit'>Income</NavLink>
            <hr />
            <NavLink onClick={()=>{setVisible(false)}} className="p-3 pl-5 cursor-pointer " to='/app/debit'>Expense</NavLink>
            <hr />
            <NavLink onClick={()=>{setVisible(false)}} className="p-3 pl-5 cursor-pointer " to='/app/about'>About</NavLink>
            <hr />
            <NavLink onClick={()=>{setVisible(false)}} className="p-3 pl-5 cursor-pointer " to='/app/contact'>Contact Us</NavLink>
            <hr />
          </div>
      </div>
    </div>
  );
}

export default Navbar;
