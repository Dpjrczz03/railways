"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <div className="min-h-screen w-full overflow-hidden bg-background text-text-primary px-8 bg-cover flex flex-col justify-between md:hidden"
        style={{backgroundImage: "url('/assets/MainLoginBG.webp')" }}
      >
        <img src="/assets/wrlogo.webp" alt="" className='h-[250px] w-[250px] mt-28 mx-auto' data-aos='fade-down' />
        <div className="flex flex-col justify-center items-center gap-6 w-2/3 mx-auto mb-5">
          <button 
           onClick={() => router.push('/signup')}
           data-aos='fade-up'
           className="bg-primary hover:bg-primary focus:bg-primary border-2 border-primary text-xl w-full rounded-lg text-white font-semibold px-5 py-2 cursor-pointer transition-all hover:scale-[1.02]">
            Register
          </button>
          <button 
           onClick={() => router.push('/login')}
           data-aos='fade-up'
           className="bg-background hover:bg-primary focus:bg-primary border-2 border-gray-300 text-xl w-full rounded-lg text-text-primary font-semibold px-5 py-2 cursor-pointer transition-all hover:scale-[1.02]">
            Login
          </button>
          <p className="mt-8 text-xs text-white tracking-wide flex flex-col z-10 mx-auto gap-2 items-center">Powered By <img src="/assets/Logo.svg" className='h-[20px]' alt="" /></p>
        </div>
      </div>



      <div className="w-[100vw] h-[100vh] bg-background md:flex hidden">
        <div className="md:w-[45vw] relative flex justify-center items-center">
          <div className="flex flex-col gap-20 m-auto">
            <img className='h-[300px] w-[300px] z-10' src="/assets/wrlogo.webp" alt="" data-aos='fade-down' />
            <p className="text-sm text-white tracking-wide flex flex-col z-10 mx-auto gap-4 items-center" data-aos='fade-down' data-aos-delay='100' >Powered By <img src="/assets/Logo.svg" className='h-[30px]' alt="" data-aos='fade-in' data-aos-delay='600' /></p>
          </div>
          <img className="h-full w-full object-cover absolute z-0" src="/assets/login-bg.svg" alt="" />
          {/* <img className="w-4/5 mx-auto my-6 lg:my-0 absolute z-10" src="/assets/wrlogo.webp" alt="" /> */}
        </div>
        <div className="w-[100vw] md:w-[55vw] flex flex-col items-center px-6 md:px-16 lg:px-36 py-24 m-auto shadow-md">
          <h1 className="text-4xl font-bold text-text-primary mb-20 text-center md:text-left md:mx-auto" data-aos='fade-left' data-aos-delay='200' >Welcome!</h1>
          <div className="flex flex-col justify-center items-center gap-10 w-2/3 mx-auto">
            <button 
             onClick={() => router.push('/signup')}
             data-aos='fade-left' data-aos-delay='300' 
             className="bg-primary hover:bg-background-secondary focus:bg-primary border-2 border-border-primary hover:border-primary hover:text-primary text-xl w-full rounded-lg text-white font-semibold px-5 py-2 cursor-pointer transition-all hover:scale-[1.02]">
              Register
            </button>
            <button 
             onClick={() => router.push('/login')}
             data-aos='fade-left' data-aos-delay='400' 
             className="bg-background hover:bg-primary focus:bg-primary border-2 border-gray-300 text-xl w-full rounded-lg text-text-primary font-semibold px-5 py-2 cursor-pointer transition-all hover:scale-[1.02]">
              Login
            </button>
        </div>
        </div>
        
      </div>
    </>
  )
}

export default Page;
