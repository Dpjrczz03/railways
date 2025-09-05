'use client';
import React, { useState, useEffect } from 'react';
import { Text, Select } from '../../../components/Input';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { message } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Register = () => {
  useEffect(() => {
      AOS.init({
        duration: 100,
        once: true,
      });
      AOS.refresh();
    }, []);

  const [states, setStates] = useState({
    name: '',
    gender: 'Male',
    age: '',
    role: '',
    yearsInService: '',
    hometown: '',
    livingSituation: 'Family',
    maritalStatus: 'No',
    kids: 0,
    kidNames: [],
    spouseName: '',
  });

  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [userId, setUserId] = useState();

  const handleChange = (field, value) => {
    if (field === 'kids') {
      const kidsCount = parseInt(value, 10) || 0;
      setStates({
        ...states,
        kids: kidsCount,
        kidNames: Array.from({ length: kidsCount }, (_, i) => states.kidNames[i] || ''),
      });
    } else {
      setStates({ ...states, [field]: value });
    }
  };

  const handleKidNameChange = (index, value) => {
    const updatedKidNames = [...states.kidNames];
    updatedKidNames[index] = value;
    setStates({ ...states, kidNames: updatedKidNames });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_info/registerUserInfo`, {...states, user_id: userId})
      .then(() => {
        message.success('Registered Successfully')
        router.push('/dashboard');
        return;
      })
    }
    catch(err) {
      message.error('Something Went Wrong')
      console.log(err.response.data);
    }
  };

  useEffect(()=>{
    (async()=>{
      const token = localStorage.getItem('jwt_token');

      // Check if token exists, if not, redirect to login
      if (!token) {
        router.push('/login');
        return; // Exit the function to prevent further execution
      }
      try{
        await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/verify`,{token: localStorage.getItem('jwt_token')}).then(async(res)=>{
        await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/getUserInfo`, {user_id: res.data.id})
          .then(async(res)=>{
            setUserId(res.data.id);
            if(res.data.has_profile) {
              router.push('/dashboard')
              return
            }
          })
      })
      }catch(err){
        console.log(err);
        if(err.response.status===401){
          localStorage.removeItem('jwt_token');
          router.push('/login');
          return
        }
        else{
          alert(err.response.data)
        }
      }


    setLoader(false);
    })()
  },[router])

  useEffect(() => {
    console.log(states);
  }, [states])

  if(loader) {
    return <></>
  }

  return (
    <div className="w-[100vw] h-[100vh] bg-background flex overflow-hidden">
      <div className="md:w-[75vw] w-full h-full px-6 md:px-16 lg:px-24 py-24 m-auto shadow-md overflow-scroll">
        <h1 className="text-4xl font-bold text-text-primary mb-10 text-center md:text-left">Register Your Information</h1>
        <form className="mt-6 flex flex-col gap-6 text-text-secondary" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Text
              col={2}
              value={states.name}
              setValue={setStates}
              disp={'name'}
              name={'Name'}
              label="Full Name"
              isRequired={true}
            />
            <Select
              col={2}
              value={states.gender}
              setValue={setStates}
              disp={'gender'}
              name={'Gender'}
              label="Gender"
              options={['Male', 'Female', 'Others']}
              isRequired={true}
            />
            <Text
              col={2}
              value={states.age}
              type="number"
              setValue={setStates}
              disp={'age'}
              name={'Age'}
              label="Age"
              isRequired={true}
            />
            <Text
              col={2}
              value={states.role}
              setValue={setStates}
              disp={'role'}
              name={'Role'}
              label="Role/Position"
              isRequired={true}
            />
            <Text
              col={2}
              value={states.yearsInService}
              type="number"
              setValue={setStates}
              disp={'yearsInService'}
              name={'YearsInService'}
              label="Years in Service"
              isRequired={true}
            />
            <Text
              col={2}
              value={states.hometown}
              setValue={setStates}
              disp={'hometown'}
              name={'Hometown'}
              label="Hometown"
              isRequired={true}
            />
            <Select
              col={2}
              value={states.livingSituation}
              setValue={setStates}
              disp={'livingSituation'}
              name={'LivingSituation'}
              label="Living With"
              options={['Family', 'Friends', 'Alone']}
              isRequired={true}
            />
            <Select
              col={2}
              value={states.maritalStatus}
              setValue={setStates}
              disp={'maritalStatus'}
              name={'MaritalStatus'}
              label="Marital Status"
              options={['No', 'Yes']}
              isRequired={true}
            />
          </div>
  
          {states.maritalStatus === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Text
                col={2}
                value={states.spouseName}
                setValue={setStates}
                disp={'spouseName'}
                name={'SpouseName'}
                label="Spouse Name"
                isRequired={true}
              />
            </div>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Text
              col={2}
              value={states.kids}
              type="number"
              setValue={setStates}
              disp={'kids'}
              name={'Kids'}
              label="Number of Kids"
              isRequired={true}
            />
          </div>
  
          {states.kids > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Array.from({ length: states.kids }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Kid ${index + 1} Name`}
                  value={states.kidNames[index] || ''}
                  onChange={(e) => handleKidNameChange(index, e.target.value)}
                  className="px-2 py-1.5 bg-background-secondary text-text-secondary ring-2 ring-border-primary focus:ring-primary outline-none focus:text-text-primary rounded w-full"
                  isRequired={true}
                />
              ))}
            </div>
          )}
  
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 px-4 py-3 text-white text-md md:text-sm bg-primary hover:bg-primaryHover rounded-md focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Register;
