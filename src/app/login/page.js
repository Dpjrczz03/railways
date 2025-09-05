'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
          AOS.init({
            duration: 500,
            once: true,
          });
          AOS.refresh();
        }, []);
    
    const handleForgotPassword = () => {
        router.push('/forgot-password'); // Navigate to Forgot Password page
    };

    const loginUser = async (email, password) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/login`, { email, password });
        localStorage.setItem('jwt_token', response.data.jwtToken);
        router.push('/dashboard');
      } catch (err) {
        setError(err.response?.data || 'Login failed. Please try again.');
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginUser(email, password); // Call login function on form submit
    };

    useEffect(() => {
      const token = localStorage.getItem('jwt_token');
  
      if (token) {
        // If token exists, redirect to /newdash and prevent rendering
        router.push('/dashboard');
      } else {
        // No token, show the page content
        setIsLoading(false);
      }
    }, [router]);
    
    if (isLoading) {
        return <></>;
      } else {
        return (
          <div className="w-[100vw] h-[100vh] bg-background flex overflow-hidden">
            <div className="md:w-[45vw] relative hidden md:flex justify-center items-center">
          <div className="flex flex-col gap-20 m-auto">
            <img className='h-[300px] w-[300px] z-10' src="/assets/wrlogo.webp" alt="" data-aos='fade-down' />
            <p className="text-sm text-white tracking-wide flex flex-col z-10 mx-auto gap-4 items-center" data-aos='fade-down' data-aos-delay='100' >Powered By <img src="/assets/Logo.svg" className='h-[30px]' alt="" data-aos='fade-in' data-aos-delay='600' /></p>
          </div>
          <img className="h-full w-full object-cover absolute z-0" src="/assets/login-bg.svg" alt="" />
          {/* <img className="w-4/5 mx-auto my-6 lg:my-0 absolute z-10" src="/assets/wrlogo.webp" alt="" /> */}
        </div>
            <div className="w-[100vw] md:w-[55vw] h-full flex flex-col items-center px-6 md:px-16 lg:px-36 py-24 m-auto shadow-md">
              <h1 className="text-4xl font-bold text-text-primary mb-10 text-center md:text-left md:ml-0 md:mr-auto" data-aos='fade-down' data-aos-delay="100">Login</h1>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 text-text-secondary w-full">
                <div className="max-w-lg" data-aos='fade-left' data-aos-delay='200'>
                  <label className="block text-md md:text-sm text-text-secondary">Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full px-4 py-2 mt-2 border rounded-md text-lg md:text-md focus:outline-none focus:ring-2 focus:ring-primary focus:text-text-primary bg-background-secondary"
                    value={email}
                  />
                </div>
                <div className="mt-4 mb-6 max-w-lg" data-aos='fade-left' data-aos-delay='300'>
                  <label className="block text-md md:text-sm text-text-secondary">Password</label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="w-full px-4 py-2 mt-2 border rounded-md text-lg md:text-md focus:outline-none focus:ring-2 focus:ring-primary focus:text-text-primary bg-background-secondary"
                    value={password}
                  />
                </div> 

                <div className="mt-4 max-w-lg mb-2 flex space-x-4" data-aos='fade-up' data-aos-delay='400'>
                  <button
                    type="submit"
                    className={`w-full md:w-1/2 px-4 py-3 text-md md:text-sm text-white rounded-md focus:outline-none bg-primary hover:bg-primaryHover focus:bg-primary`}
                  >
                    Login
                  </button>
                  {/* <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-1/2 px-4 py-2 text-[#ec3237] hover:text-white hover:bg-[#ec3237] transition-all focus:text-[#ec3237] bg-white border rounded-md focus:outline-none border-[#ec3237] hover:border-[#ec3237]"
                  >
                    Forgot Password
                  </button> */}
                </div>
    
                <div className="rounded-b-md py-2" data-aos='fade-up' data-aos-delay='500'>
                  <p className='text-text-secondary flex gap-2 items-center'>
                    Don&apos;t have an Account?
                    <Link href="/signup" className="text-primary text-lg">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        );
      }
}

export default Login;
