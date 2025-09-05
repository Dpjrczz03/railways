'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // State for checkbox
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      AOS.init({
        duration: 500,
        once: true,
      });
      AOS.refresh();
    }, []);

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!isCheckboxChecked) return; // Prevent form submission if the checkbox is unchecked
  
      await axios
        .post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/register`, { email, password })
        .then((res) => {
          localStorage.setItem("jwt_token", res.data.jwtToken)
          router.push(`/signup/register`);
        })
        .catch((err) => {
          alert(err.response.data);
        });
    };
    
    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
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


    if(isLoading){ 
  return(<></>)
}
else{
  return (
    <div className='h-[100vh] w-[100vw] relative bg-background flex overflow-hidden'>
      <div className="hidden md:w-[45vw] relative md:flex justify-center items-center">
          <div className="flex flex-col gap-20 m-auto">
            <img className='h-[300px] w-[300px] z-10' src="/assets/wrlogo.webp" alt="" data-aos='fade-down' />
            <p className="text-sm text-white tracking-wide flex flex-col z-10 mx-auto gap-4 items-center" data-aos='fade-down' data-aos-delay='100' >Powered By <img src="/assets/Logo.svg" className='h-[30px]' alt="" data-aos='fade-in' data-aos-delay='600' /></p>
          </div>
          <img className="h-full w-full object-cover absolute z-0" src="/assets/login-bg.svg" alt="" />
          {/* <img className="w-4/5 mx-auto my-6 lg:my-0 absolute z-10" src="/assets/wrlogo.webp" alt="" /> */}
        </div>
      <div className="w-[100vw] md:w-[55vw] h-full flex flex-col items-center px-6 md:px-16 lg:px-36 py-24 m-auto shadow-md">
        <h1 className="text-4xl font-bold text-text-primary mb-10 text-center md:text-left md:ml-0 md:mr-auto" data-aos='fade-down' data-aos-delay="100" >Register</h1>
        <form className="mt-6 flex flex-col gap-2 text-text-secondary w-full" onSubmit={handleSubmit}>
          <div className='max-w-lg' data-aos='fade-left' data-aos-delay='200'>
            <label className="block text-md md:text-sm text-text-secondary">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md text-lg md:text-md focus:outline-none focus:ring-2 focus:ring-primary focus:text-text-primary bg-background-secondary"
            />
          </div>
          <div className="mt-4 mb-6 max-w-lg" data-aos='fade-left' data-aos-delay='300'>
            <label className="block text-md md:text-sm text-text-secondary">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md text-lg md:text-md focus:outline-none focus:ring-2 focus:ring-primary focus:text-text-primary bg-background-secondary"
            />
          </div>

          <div className="mt-4 max-w-lg mb-2 flex space-x-4 items-center ml-2" data-aos='fade-left' data-aos-delay='400'>
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isCheckboxChecked}
              onChange={handleCheckboxChange}
              className="h-6 w-6 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="terms-checkbox" className="ml-2 text-text-secondary">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="mt-6 max-w-lg mb-2 flex space-x-4" data-aos='fade-left' data-aos-delay='500'>
            <button
              type="submit"
              className={`w-full md:w-1/2 px-4 py-3 text-white rounded-md focus:outline-none transition-all ${
                isCheckboxChecked
                  ? 'bg-primary hover:bg-primaryHover focus:bg-primary'
                  : 'bg-button-disabled cursor-not-allowed'
              }`}
              disabled={!isCheckboxChecked}
            >
              Create Account
            </button>
          </div>
          <div className="rounded-b-md py-2" data-aos='fade-left' data-aos-delay='600'>
            <p className='text-text-secondary flex gap-2 items-center'>
              Already have an Account?
              <Link href="/login" className="text-primary text-lg">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
}

export default Signup;
