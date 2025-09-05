"use client";
import Header from '@/components/Header';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation'
import ChartComponent from '@/components/LineChartComponent';
import axios from "axios";

const ResultsPage = () => {
  const router = useRouter()
  const [loader, setLoader] = useState(true)
  const [mainData, setMainData] = useState([]);
  const [results, setResults] = useState([])
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
          await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/getresults`,{user_id: res.data.id}).then((res)=>{
            // setMainData(res.data)
            setResults(transformData(res.data, "analyzed_at", "analysis_result"))
            console.log(res.data)
          })
      })
      } catch(err){
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

  function transformData(data, dateKey, resultKey) {
    return data.map(item => {
      const date = new Date(item[dateKey]).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit"
      });

      const results = item[resultKey];
      return {
        date,
        "Stress Level": results.Stress_level,
        Alertness: results.Alertness,
        Fatigue: results.Fatigue,
        "Well Being": results.Well_being,
        Happiness: results.Happiness,
        Sadness: results.Sadness
      };
    });
  }

  const [activeTab, setActiveTab] = useState('Today'); // 'Today', 'Past 7 Days', 'Past 30 Days'
  const [showAllFactors, setShowAllFactors] = useState(false); // State to toggle factor visibility
  const [selectedFactors, setSelectedFactors] = useState({
    'Stress Level': true,
    'Alertness': true,
    'Fatigue': true,
    'Well Being': false,
    'Happiness': false,
    'Sadness': false,
  });

  const colors = {
    'Stress Level': 'red',
    'Alertness': 'blue',
    'Fatigue': 'yellow',
    'Well Being': 'green',
    'Happiness': 'purple',
    'Sadness': 'gray',
  };

  // const results = [
  //   { date: '18/12', 'Stress Level': 7, 'Alertness': 9, 'Fatigue': 6, 'Well Being': 9, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '17/12', 'Stress Level': 6, 'Alertness': 8, 'Fatigue': 7, 'Well Being': 8, 'Happiness': 7, 'Sadness': 4 },
  //   { date: '16/12', 'Stress Level': 8, 'Alertness': 7, 'Fatigue': 5, 'Well Being': 7, 'Happiness': 6, 'Sadness': 6 },
  //   { date: '15/12', 'Stress Level': 5, 'Alertness': 6, 'Fatigue': 8, 'Well Being': 9, 'Happiness': 9, 'Sadness': 3 },
  //   { date: '14/12', 'Stress Level': 4, 'Alertness': 9, 'Fatigue': 6, 'Well Being': 8, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '13/12', 'Stress Level': 7, 'Alertness': 8, 'Fatigue': 5, 'Well Being': 7, 'Happiness': 7, 'Sadness': 4 },
  //   { date: '12/12', 'Stress Level': 6, 'Alertness': 7, 'Fatigue': 6, 'Well Being': 6, 'Happiness': 6, 'Sadness': 7 },
  //   { date: '11/12', 'Stress Level': 9, 'Alertness': 6, 'Fatigue': 7, 'Well Being': 8, 'Happiness': 8, 'Sadness': 6 },
  //   { date: '10/12', 'Stress Level': 8, 'Alertness': 5, 'Fatigue': 8, 'Well Being': 9, 'Happiness': 7, 'Sadness': 5 },
  //   { date: '09/12', 'Stress Level': 5, 'Alertness': 7, 'Fatigue': 6, 'Well Being': 8, 'Happiness': 9, 'Sadness': 4 },
  //   { date: '08/12', 'Stress Level': 6, 'Alertness': 9, 'Fatigue': 5, 'Well Being': 9, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '07/12', 'Stress Level': 7, 'Alertness': 8, 'Fatigue': 7, 'Well Being': 7, 'Happiness': 6, 'Sadness': 6 },
  //   { date: '06/12', 'Stress Level': 8, 'Alertness': 7, 'Fatigue': 6, 'Well Being': 9, 'Happiness': 7, 'Sadness': 5 },
  //   { date: '05/12', 'Stress Level': 6, 'Alertness': 8, 'Fatigue': 7, 'Well Being': 6, 'Happiness': 8, 'Sadness': 6 },
  //   { date: '04/12', 'Stress Level': 5, 'Alertness': 9, 'Fatigue': 6, 'Well Being': 7, 'Happiness': 9, 'Sadness': 4 },
  //   { date: '03/12', 'Stress Level': 7, 'Alertness': 8, 'Fatigue': 8, 'Well Being': 8, 'Happiness': 7, 'Sadness': 5 },
  //   { date: '02/12', 'Stress Level': 8, 'Alertness': 6, 'Fatigue': 5, 'Well Being': 9, 'Happiness': 6, 'Sadness': 6 },
  //   { date: '01/12', 'Stress Level': 6, 'Alertness': 7, 'Fatigue': 6, 'Well Being': 7, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '30/11', 'Stress Level': 9, 'Alertness': 8, 'Fatigue': 7, 'Well Being': 8, 'Happiness': 6, 'Sadness': 7 },
  //   { date: '29/11', 'Stress Level': 7, 'Alertness': 9, 'Fatigue': 6, 'Well Being': 6, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '28/11', 'Stress Level': 6, 'Alertness': 7, 'Fatigue': 8, 'Well Being': 7, 'Happiness': 7, 'Sadness': 4 },
  //   { date: '27/11', 'Stress Level': 8, 'Alertness': 6, 'Fatigue': 7, 'Well Being': 9, 'Happiness': 9, 'Sadness': 6 },
  //   { date: '26/11', 'Stress Level': 7, 'Alertness': 8, 'Fatigue': 6, 'Well Being': 8, 'Happiness': 6, 'Sadness': 5 },
  //   { date: '25/11', 'Stress Level': 9, 'Alertness': 9, 'Fatigue': 5, 'Well Being': 6, 'Happiness': 8, 'Sadness': 7 },
  //   { date: '24/11', 'Stress Level': 6, 'Alertness': 7, 'Fatigue': 7, 'Well Being': 7, 'Happiness': 7, 'Sadness': 4 },
  //   { date: '23/11', 'Stress Level': 8, 'Alertness': 6, 'Fatigue': 6, 'Well Being': 9, 'Happiness': 9, 'Sadness': 6 },
  //   { date: '22/11', 'Stress Level': 7, 'Alertness': 8, 'Fatigue': 5, 'Well Being': 8, 'Happiness': 8, 'Sadness': 5 },
  //   { date: '21/11', 'Stress Level': 9, 'Alertness': 9, 'Fatigue': 6, 'Well Being': 6, 'Happiness': 7, 'Sadness': 7 },
  //   { date: '20/11', 'Stress Level': 6, 'Alertness': 7, 'Fatigue': 8, 'Well Being': 7, 'Happiness': 6, 'Sadness': 4 },
  //   { date: '19/11', 'Stress Level': 8, 'Alertness': 6, 'Fatigue': 7, 'Well Being': 9, 'Happiness': 9, 'Sadness': 6 },
  // ];
  const todayResults = results[0];
  const past7Days = results.slice(0, 7);
  const past30Days = results.slice(0, 30);

  const handleCheckboxChange = (factor) => {
    setSelectedFactors((prev) => ({
      ...prev,
      [factor]: !prev[factor],
    }));
  };
  if(loader){
    return(<></>)
  }
  else{

  const renderContent = () => {
    let data;
    if (activeTab === 'Today') {
      data = [todayResults];
    } else if (activeTab === 'Weekly') {
      data = past7Days;
    } else {
      data = past30Days;
    }

      if (activeTab === 'Today') {
        const visibleFactors = Object.entries(data[0])
            .filter(([label]) => label !== 'date')
            .slice(0, showAllFactors ? undefined : 3); // Show all factors if toggled



        return (
            <div className="flex flex-col gap-6 bg-background-secondary p-6 border border-border-primary rounded-lg shadow-md lg:w-2/3">
              {visibleFactors.map(([label, value], index) => (
                  <div key={index}>
                    <div className="flex w-full justify-between">
                      <p className="text-lg font-medium text-text-secondary mb-2">{label}</p>
                      <p className="text-sm text-text-muted mt-1">{value} / 10</p>
                    </div>
                    <div className="w-full bg-background-tertiary rounded-full h-6">
                      <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(value / 10) * 100}%`,
                            backgroundColor: `${colors[label]}`,
                          }}
                      ></div>
                    </div>

                  </div>
              ))}

              {/* Show More / Show Less Button */}
              <button
                  onClick={() => setShowAllFactors(!showAllFactors)}
                  className="mt-2 text-text-muted font-medium hover:underline"
              >
                {showAllFactors ? 'Show Less' : 'Show More'}
              </button>
            </div>
        );
      } else {
        const datasets = Object.entries(selectedFactors)
            .filter(([factor, isSelected]) => isSelected)
            .map(([factor]) => ({
              label: factor,
              data: data.map((item) => item[factor]),
              borderColor: colors[factor],
              fill: false,
              tension: 0.1,
            }));

        return (
            <div className="flex flex-col gap-10 bg-background-secondary p-5 border border-border-primary rounded-lg shadow-md lg:w-2/3">
              <ChartComponent data={data} datasets={datasets} />
              <p className="text-text-muted text-md -mb-6">Select Factors:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(colors).map((factor) => {
                  const isSelected = selectedFactors[factor];
                  const bgColor = isSelected ? colors[factor] : 'background-tertiary';
                  return (
                      <button
                          key={factor}
                          onClick={() => handleCheckboxChange(factor)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-md box-border ${
                              factor === 'Fatigue' && isSelected ? 'text-black' : 'text-white'
                          } ${!isSelected ? 'border border-border-primary' : ''}`}
                          style={{
                            backgroundColor: isSelected ? colors[factor] : '',
                          }}
                      >
                        {factor}
                      </button>
                  );
                })}
              </div>
            </div>
        );
      }
    };

    const renderTabs = () => {
      return (
          <div className="w-full flex gap-4">
            {['Today', 'Weekly', 'Monthly'].map((tab) => (
                <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer ${
                        activeTab === tab
                            ? 'bg-background-secondary border-primary text-text-primary font-semibold'
                            : 'bg-background-secondary border-border-primary text-text-secondary'
                    } hover:bg-background-tertiary focus:bg-background-tertiary border p-4 rounded-lg mb-6 w-1/3 shadow-md text-center flex items-center`}
                >
                  <p className="text-lg m-auto">{tab}</p>
                </div>
            ))}
          </div>
      );
    };

    return (
        <>
          <Header />
          <div className="w-screen min-h-screen bg-background text-text-primary flex flex-col px-6 py-8 lg:px-16 lg:py-16">
            <h1 className="text-4xl font-bold mb-8">Results</h1>
            {renderTabs()}
            <div className="flex flex-col md:flex-row gap-6 w-full">
              {renderContent()}
              {/* <div className="flex flex-col gap-2 bg-background-secondary p-5 border border-border-primary rounded-lg shadow-md lg:w-2/3">
                <h3 className="text-text-primary text-lg text-semibold">Recommendations:</h3>
                <ul className="list-inside list-disc ml-3 text-text-secondary">
                  <li className="">Lessen Work Hours</li>
                  <li className="">Lessen Work Hours</li>
                  <li className="">Lessen Work Hours</li>
                  <li className="">Lessen Work Hours</li>
                </ul>
              </div> */}
            </div>

          </div>
        </>
    );
    }



};

export default ResultsPage;