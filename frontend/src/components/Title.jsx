import React from 'react';

function Title({text1,text2}) {
  return (
    <div className='inline-flex gap-2 bg-gradient-to-r from-yellow-500 to-yellow-800 w-full justify-center py-3 items-center mb-3'>
      <p className='text-gray-700'>{text1} <span className='text-gray-900 font-medium'>{text2}</span> </p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  );
}

export default Title;
