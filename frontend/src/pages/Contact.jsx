import React from 'react';
import { assets } from '../assets/assets';

function Contact() {
  return (
    <div className='bg-white px-5 py-2 mt-5'>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact} className='w-full md:max-w-[480px]' alt="" />
        <div className='flex flex-col justify-center items-start gap-6 '>
          <p className='font-semibold text-xl text-gray-600'>Our Details</p>
          <p className='text-gray-500'>54709 wllms station <br />suite 350 washington usa</p>
          <p className='text-gray-500'>TEl :(415)555-8086 <br />Email:ishayankundu6@gmail.com</p>
          
        </div>
      </div>
    </div>
  );
}

export default Contact;
