import React from 'react';
import { assets } from '../assets/assets';

function About() {
  return (
    <div className='bg-white w-full mt-5 p-5 flex flex-col items-center'>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about} alt="" />
        <div className='flex flex-col justify-center gap-6 ms:w-2/4 text-gray-600'>
  <p>
    Welcome to FinTrackr – your smart expense tracking solution. We are committed to helping individuals take control of their finances with ease, clarity, and confidence. Our platform provides intuitive tools for monitoring income, expenses, and overall financial health.
  </p>
  <p>
    Our team is passionate about simplifying personal finance. From daily spending to long-term budgeting, we ensure our features are built for real life – fast, secure, and easy to use. Every feature is designed with precision to make financial management effortless for everyone.
  </p>
  <b>Our Mission</b>
  <p>
    Our mission is to empower users to make informed financial decisions through clear visualizations, real-time insights, and efficient tracking. We aim to promote financial awareness, encourage better saving habits, and ultimately help our users build a more secure future.
  </p>
</div>

      </div>

      
    </div>
  );
}

export default About;
