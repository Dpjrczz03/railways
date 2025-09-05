'use client';

import React, { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MoonIcon, BellIcon, SunIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { message } from 'antd';
import { LayoutDashboard, FileText } from 'lucide-react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Dummy Data for user profile
const dummyProfile = {
  first_name: "John",
  last_name: "Doe",
  designation: "Analyst",
  role: "HR"
};

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();
    const [pfp, setPfp] = useState('/assets/300-1.jpg'); // Placeholder profile image
    const userProfile = dummyProfile; // Use dummy profile data
    const [loader, setLoader] = useState(true);
    const router = useRouter();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      };

      const handlesignout = () => {
        localStorage.removeItem('jwt_token');
        router.push('/login');
        message.success('Signed out successfully!');
      };

      
      // useEffect(()=>{
      //   (async()=>{
      //     const token = localStorage.getItem('jwt_token');
    
      //     // Check if token exists, if not, redirect to login
      //     if (!token) {
      //       router.push('/login');
      //       return; // Exit the function to prevent further execution
      //     }
      //     try{
      //       await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/verify`,{token: localStorage.getItem('jwt_token')}).then(async(res)=>{
      //       await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/getUserInfo`, {user_id: res.data.id})
      //         .then(async(res)=>{
      //           if(!res.data.has_profile) {
      //             router.push('/signup/register')
      //             return
      //           }
      //         })
      //     })
      //     } catch(err){n
      //       if(err.response.status===401){
      //         localStorage.removeItem('jwt_token');
      //         router.push('/login');
      //         return
      //       }
      //       else{
      //         alert(err.response.data)
      //       }
      //     }
    
    
      //   setLoader(false);
      //   })()
      // },[router])

      // if(loader) {
      //   return <></>
      // }

    return (
        <Disclosure as="nav" className="bg-background text-text-primary shadow border-b border-border-primary">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-screen-xl px-6 sm:px-4 lg:px-8">
                <div className="relative flex h-16 pt-2 items-center justify-between">
                  {/* Right: Logo */}
                  <div className="flex items-center justify-start space-x-4 W-1/3">
                    <Image src="/assets/Logo.svg" alt="Chayan" width={84} height={24} onClick={(e) => {
                      e.preventDefault();
                      router.push('/dashboard')
                    }} />
                  </div>

                  {/* Left: Dark Mode, Notifications, and User Profile */}
                  <div className="flex items-center justify-end space-x-4 w-fit">
                    <div className="flex-shrink-0">
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex rounded-full bg-background-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <img
                              src={pfp ? pfp : '/assets/images/300-1.jpg'} // Placeholder profile picture
                              alt="Profile"
                              className="h-[45px] w-[45px] object-cover rounded-full border-[3px] border-border-primary"
                              style={{ zIndex: 1, left: '9%' }}
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md text-text-secondary bg-background-tertiary py-1 shadow-lg ring-1 ring-border-primary ring-opacity-5 focus:outline-none dark:bg-gray-800">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/results')
                                  }}
                                  className={classNames(
                                    active ? 'bg-background-tertiary' : 'text-primary',
                                    'block px-4 py-2 text-sm text-text-secondary norder border-border-primary',
                                  )}
                                >
                                  Results
                                </div>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={handlesignout}
                                  className={classNames(
                                    active ? 'bg-background-tertiary' : 'text-primary',
                                    'block px-4 py-2 text-sm text-text-secondary norder border-border-primary',
                                  )}
                                >
                                  Sign out
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  <Disclosure.Button
                    as="a"
                    href="/"
                    className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700 dark:bg-indigo-700 dark:text-indigo-200"
                  >
                    Dashboard
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/job-listing"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100"
                  >
                    Job Listing
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/job-profiles"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100"
                  >
                    Job Profiles
                  </Disclosure.Button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
    );
}

export default Header;
