// components/InterviewPage.js
'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import Header from '@/components/Header'
import './styles.css'
import { message } from 'antd';
import { Phone, PhoneOff, PhoneForwarded, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import { Modal } from 'antd';

// const TypingEffect = ({ text }) => {
//   const [displayedText, setDisplayedText] = useState('');

//   useEffect(() => {
//     if (!text) {
//       setDisplayedText(''); // Clear displayed text if text is undefined or null
//       return;
//     }

//     let index = 0;
//     setDisplayedText(''); // Clear old text

//     const timeout = setTimeout(() => {
//       const interval = setInterval(() => {
//         if (index < text.length) {
//           setDisplayedText((prev) => prev + text[index]);
//           index++;
//         } else {
//           clearInterval(interval);
//         }
//       }, 50); // Adjust typing speed here (ms per letter)
//     }, 100); // Delay to ensure text is cleared before typing starts

//     return () => {
//       clearTimeout(timeout);
//       setDisplayedText(''); // Cleanup text on unmount or text change
//     };
//   }, [text]);

//   return <span>{displayedText}</span>;
// };

const InterviewPage = ({ prompt }) => {
  const router = useRouter();
  const videoRef = useRef(null);

  const canvasRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const questionsRef = useRef([]);
  const [questions, setQuestions] = useState([
    'Hi Ankit, what’s your favorite way to spend your free time when you’re at home?',
    'What’s one thing about Jabalpur that you really miss while working in Mumbai?',
    'Tell us something fun about your kids, Ayan and Rahul—what keeps them the most entertained?',
    'If you could pick any place for your next holiday, where would you go and why?',
    'What’s the best memory you’ve had on the job as a loco pilot so far?',
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const timerId = useRef(null);
  const [finalLoader, setFinalLoader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);


  // Video Recording States
  const mediaRecorderRef = useRef(null);
  const mediaRecorderRef1 = useRef(null);
  const currentQuestionIndexRef = useRef(0);
  const videoChunks = useRef([]);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState();
  const timeRef = useRef(0);
  const [loader, setLoader] = useState(true);

  // Speech Recognition Ref
  const recognitionRef = useRef(null);

  // Silence Timeout Ref
  const silenceTimeoutRef = useRef(null);
  const userIdRef = useRef();
  const usernameRef = useRef(null);
  const sessionIdRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const followupRef = useRef(0);
  const audioUrlRef = useRef(null)
  const [personalData, setPersonalData] = useState()
  const [cameranotaccessible, setcameranotaccessible] = useState(false);
  const [taskDetails, setTaskDetails] = useState();
  const [pfp, setPfp] = useState('/media/300-1.jpg')
  const interviewRef = useRef(false)
  const audioRef = useRef(null);

  function showConfirmModal() {
    setIsModalVisible(true);
  }

  function handleModalOk() {
    setIsModalVisible(false);
    handleInterviewEnd(); // Proceed to end the interview
  }

  function handleModalCancel() {
    setIsModalVisible(false);
  }

  const transcriptionRef = useRef(null)
  const createSession = async () => {
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/start-session`,
          { user_id: userIdRef.current }
      );
      sessionIdRef.current = response.data.session_id;
      console.log('Session created successfully:', response.data.session_id);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const finalize = async () => {
    try {
      stopSpeaking()
      setFinalLoader(true);

      await axios
          .post(
              `${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/finalize-session`,
              { user_id: userIdRef.current, session_id: sessionIdRef.current, profileData}
          )
          .then(() => {
            // setFinalLoader(false)
            router.push('/results');
          });
    } catch (err) {
      console.error('Error finalizing uploads', err);
      router.push('/dashboard')
    }
  };

  useEffect(() => {
    (async () => {
      if (loader) {
        const token = localStorage.getItem('jwt_token');

        if (!token) {
          router.push('/login');
          return;
        }

        try {
          await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/verify`, { token })
              .then(async(res) => {
                userIdRef.current = res.data.id; // Persist userId in useRef
                setUserId(res.data.id);
                await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/getUserDetails`, {user_id: res.data.id})
                    .then((res) => {
                      setProfileData(res.data)
                    })
              });
        } catch (err) {
          console.error(err);
          if (err.response.status === 401) {
            localStorage.removeItem('jwt_token');
            router.push('/login');
          } else {
            alert(err.response.data);
          }
        }
        setLoader(false)
      }
    })();
  }, [router, loader]);

  useEffect(() => {
    (async () => {
      if(profileData){
        await axios
            .post('/api/askQuestion', {
              prompt: `${profileData.name} is a loco pilot in western railway in Mumbai India for goods train. He is married with ${profileData.kids} kids. His wife name is ${profileData.spouse_name}. It’s been 8 years ${profileData.name} has been with western Railway and has been promoted from Assistant Loco Pilot to Loco Pilot 3 years back. He is originally from ${profileData.hometown}, India, and his parents and other relatives stay there. He primarily speaks Hindi at home but understands a little English too. ${profileData.name} completed his last duty yesterday at 7:00 hrs IST. His last duty lasted for 60 hours, comprising 4 trips of 8 hours each with 8-hour breaks in between. He was on holiday last month for 5 days from 15 Dec 2024 to 29 Dec 2024.  

              Generate a list of 6 conversational, casual, and empathetic one-liner questions. These questions should assess ${profileData.name} on stress level, alertness, and fatigue without directly asking about these factors or sounding like an interrogation. Ensure the questions feel like a friendly conversation and are focused on ${profileData.name}'s recent duty, upcoming duty, and personal life. Avoid asking for elaborate or detailed responses. Begin with a warm greeting.  
              Only output the questions as an array and nothing else.`
              ,
            })
            .then((res) => {
              questionsRef.current = res.data;
              setIsQuestionsLoaded(true);
            });
      }

    })();
  }, [profileData]);

  useEffect(() => {
    console.log(isQuestionsLoaded);
  }, [isQuestionsLoaded]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch((err) => {
          console.error('Microphone access denied:', err);
          alert('Microphone access is required.');
        });
    if (!stream) return;

    console.log('Audio tracks:', stream.getAudioTracks());

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Smaller size for faster analysis
    source.connect(analyser);

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const audioChunks = [];

    let silenceStart = null;

    mediaRecorder.ondataavailable = (event) => {
      // console.log('Audio data available:', event.data);
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      console.log('MediaRecorder stopped. Processing audio...');
      console.log(audioChunks);
      const audioBlob = new Blob(audioChunks, {
        type: 'audio/webm; codecs=opus',
      });
      await sendAudioToServer(audioBlob);

      audioChunks.length = 0; // Clear chunks after processing

      // if (interviewStarted) {
      //   console.log('Restarting MediaRecorder...');
      //   startRecording();  // Restart recording after stop
      // }
    };

    mediaRecorder.start(1000); // Trigger data every second
    console.log('MediaRecorder started.');

    // 🔴 Silence Detection Logic
    const detectSilence = () => {
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buffer);

      const average = buffer.reduce((a, b) => a + b, 0) / buffer.length;
      // console.log(average)
      if (average < 45) {
        // Threshold for silence
        if (!silenceStart) {
          silenceStart = Date.now();
        }
        if (Date.now() - silenceStart > 2000) {  // 2 seconds of silence
          console.log('Silence detected. Stopping recorder...');
          mediaRecorder.stop();
          return;
        }
      } else {
        silenceStart = null; // Reset if audio is detected
      }

      requestAnimationFrame(detectSilence);
    };

    detectSilence();
  };

  // Effect to set up Speech Recognition

  function pushAfterIndex(array, index, element) {
    if (index < -1 || index >= array.length) {
      throw new Error('Index out of bounds');
    }
    // Use array.slice() and concat to insert the element at the desired position
    return [...array.slice(0, index + 1), element, ...array.slice(index + 1)];
  }

  function removeAfterIndex(arr, index) {
    // Check if the index is within the valid range and not the last index
    if (index < arr.length - 1) {
      return arr.slice(0, index + 1);
    }
    return arr; // If it's the last index, return the array as is
  }

  const sendAudioToServer = async (audioBlob) => {
    if(interviewRef.current) {


      try {
        const formData = new FormData();
        formData.append(
            'current_question',
            questionsRef.current[currentQuestionIndexRef.current]
        );
        formData.append(
            'next_question',
            questionsRef.current[currentQuestionIndexRef.current + 1] || null
        );
        formData.append('profileData', profileData)
        formData.append('audio', audioBlob, `question-${currentQuestionIndexRef.current + 1}`);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/upload_audio`,
                formData
            )
            .then(async (res) => {
              // console.log(res.data);
              // if (Date.now() - timeRef.current > 60000 * 5) {
              //   questionsRef.current = removeAfterIndex(
              //     questionsRef.current,
              //     currentQuestionIndexRef.current
              //   );
              // }
              if (
                  res.data.is_follow_up === 1 && followupRef.current <= 1
              ) {
                followupRef.current += 1
                questionsRef.current = pushAfterIndex(
                    questionsRef.current,
                    currentQuestionIndexRef.current,
                    res.data.question
                );
              } else {
                followupRef.current = 0
              }
              // const nextQuestion = await generateAdaptiveQuestion(questionsRef.current[currentQuestionIndexRef.current], res.data.transcription, questionsRef.current[currentQuestionIndexRef.current+1]||null)
              // console.log("nextQuestion: ", nextQuestion)
              // setTotalTranscript(res.data.transcription)
              resetSilenceTimeout();
            });
      } catch (error) {
        console.error('Error sending audio to server:', error);
      }
    }
  };

  const stopRecording = () => {
    console.log('Stopping audio recording...');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
    }
  };
  const resetSilenceTimeout = () => {
    proceedToNextQuestion();
  };

  const proceedToNextQuestion = async () => {
    if (
        mediaRecorderRef1.current &&
        mediaRecorderRef1.current.state !== 'inactive'
    ) {
      stopVideoRecording(); // Stop current video recording
      await uploadVideoSegment(); // Wait for video upload
    }

    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < questionsRef.current.length) {
        stopRecording();
        speakQuestion(questionsRef.current[nextIndex]).then(() => {
          startRecording();
          startVideoRecording();
        });
      } else {
        console.log('Interview complete.');
        setInterviewStarted(false);
        message.success('Interview Completed!');
      }
      currentQuestionIndexRef.current = nextIndex;
      return nextIndex;
    });
  };

  useEffect(() => {
    return () => {
      stopRecording();
      clearInterval(timerId.current);
      clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  // Function to start the countdown timer
  const startTimer = () => {};

  // Function to handle starting the interview
  const startInterview = async () => {
    await createSession();
    setInterviewStarted(true);
    interviewRef.current = true// Start the interview session
    setTimeLeft(180); // Reset the timer to 3 minutes
    timeRef.current = Date.now();
    await speakQuestion(questionsRef.current[0]); // Speak the first question
    startRecording();
    startVideoRecording(); // Begin video recording
    startTimer(); // Start countdown timer
    // startSpeechRecognition(); // Enable speech recognition
  };

  // Function to speak a question
  const speakQuestion = async (question) => {
    setIsSpeaking(true);
    console.log(`Speaking question: "${question}"`);
    try {
      const audioUrl = await synthesizeSpeech(question);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio; // Save the audio instance to the ref

        return new Promise((resolve, reject) => {
          audio.play();
          audio.onended = () => {
            console.log('Finished speaking the question.');
            setIsSpeaking(false);
            audioRef.current = null; // Clear the ref when done
            resolve();
          };
          audio.onerror = (err) => {
            console.error('Error playing audio:', err);
            setIsSpeaking(false);
            audioRef.current = null; // Clear the ref on error
            reject(err);
          };
        });
      }
    } catch (error) {
      console.error('Error in speakQuestion:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset playback position
      setIsSpeaking(false);
      audioRef.current = null; // Clear the ref
      console.log('Audio stopped.');
    }
  };

  // Function to synthesize speech
  const synthesizeSpeech = async (text) => {
    try {
      const response = await axios.post(
          '/api/synthesizeSpeech',
          { text },
          { responseType: 'blob' }
      );
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      return null;
    }
  };

  // Effect to set up video stream

  const setupVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute to prevent echo
      }
    } catch (error) {
      setcameranotaccessible(true);
      console.error('Error accessing webcam:', error);
    }
  };
  useEffect(() => {
    (async()=>{
      await setupVideoStream()
    })()
  }, []);

  // Function to start video recording
  const startVideoRecording = async() => {
    // console.log('videoref', videoRef.current)
    if(videoRef.current && !videoRef.current.srcObject) {
      await setupVideoStream()
    }
    if (!videoRef.current || !videoRef.current.srcObject) {
      console.error('Video stream not available.');
      return;
    }

    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef1.current = mediaRecorder;
    videoChunks.current = [];
    console.log('bahar ka chala');
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log('andar ka chala');
        console.log('Video data available:', event.data.size, 'bytes');
        videoChunks.current.push(event.data);
      } else {
        console.warn('No video data available in this chunk.');
      }
    };

    mediaRecorder.onstop = () => {
      console.log('Video recording stopped.');
      if (videoChunks.current.length > 0) {
        const videoBlob = new Blob(videoChunks.current, { type: 'video/webm' });
        console.log('Recorded video size:', videoBlob.size, 'bytes');

        // Call the updated upload function with videoBlob and current question index
        uploadVideoSegment(videoBlob, currentQuestionIndexRef.current);
      }
    };

    mediaRecorder.onerror = (error) => {
      console.error('MediaRecorder error:', error);
    };

    mediaRecorder.start();
    console.log('Video recording started.');
  };

  const stopVideoRecording = () => {
    if (
        mediaRecorderRef1.current &&
        mediaRecorderRef1.current.state !== 'inactive'
    ) {
      mediaRecorderRef1.current.stop();
      console.log('Stopping video recording...');
    } else {
      console.warn('MediaRecorder is not recording.');
    }
  };

  // Function to upload video segment
  const uploadVideoSegment = async (videoBlob, questionIndex) => {
    console.log('Initiating video upload...');

    if (!videoBlob) {
      console.error('No videoBlob provided for upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoBlob, `question_${questionIndex}.webm`);
    formData.append('questionNumber', questionIndex);
    // formData.append('question', questionsRef.current[currentQuestionIndexRef.current]);
    formData.append('user_id', userIdRef.current);
    formData.append('session_id', sessionIdRef.current);

    // formData.append('audio_url', audioUrlRef.current)
    // formData.append('transcription', transcriptionRef.current)

    try {
      await axios
          .post(
              `${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/upload`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
          )
          .then(async (response) => {
            if (response.status === 201) {
              console.log(
                  `Video for question ${questionIndex} uploaded successfully.`
              );

              if (
                  currentQuestionIndexRef.current === questionsRef.current.length
              ) {
                await finalize();
              }
            } else {
              console.error(
                  `Failed to upload video for question ${questionIndex}. Response: ${response.status}, ${response.statusText}`
              );
            }
          });
    } catch (error) {
      console.error(
          `Error during video upload for question ${questionIndex}:`,
          error
      );
    }
  };

  if (loader) {
    return <></>;
  }
  if (finalLoader) {
    return (
        <div className="h-screen w-screen bg-white flex flex-col gap-2 items-center justify-center">
          <img src="/assets/Loader.gif" alt="analysing..." />
          <p>Analysing Results ...</p>
        </div>
    );
  }

  async function handleInterviewEnd() {
    stopSpeaking()
    interviewRef.current = false
    currentQuestionIndexRef.current = questionsRef.current.length-1
    await finalize()
  }

  return (
      <>
        <Header/>
        <div className="p-4 bg-background h-[calc(100vh-64px)] overflow-auto text-text-primary">
          <div className="flex h-full gap-4 flex-col md:flex-row">
            {/*<div className="p-4 md:hidden w-full flex flex-col gap-4 justify-center bg-background-secondary rounded-lg border border-border-primary">*/}
            {/*  <h2*/}
            {/*      className="text-2xl font-semibold text-text-primary">{taskDetails.header.title.slice(0, taskDetails.header.title.indexOf('at'))}</h2>*/}
            {/*  <h2*/}
            {/*      className="text-md font-medium text-text-secondary">{taskDetails.header.title.slice(taskDetails.header.title.indexOf('at') + 2, taskDetails.header.title.length)}</h2>*/}
            {/*</div>*/}
            {/* First Column (2/3 Width) */}
            <div className="relative w-full h-full md:w-2/3 flex flex-col items-center">

              {/* Before Interview Starts */}
              {!interviewStarted ? (
                  <div className="relative flex flex-col gap-4 items-center justify-center border border-border-primary rounded-lg bg-background-tertiary md:h-full w-full p-4 h-full">
                    <div className="relative w-52 h-52 mx-auto rounded-full overflow-hidden filter blur-sm">
                      <img
                          src="/assets/avantika.jpeg"
                          alt="Avantika"
                          className="h-full w-full"
                      />
                    </div>
                  </div>
              ) : (
                  // After Interview Starts
                  <div className="relative flex flex-col justify-center border border-border-highlight rounded-lg bg-background-secondary md:h-full w-full p-4 h-full">
                    {/* Timer */}
                    {/*<div className="absolute top-2 left-2 bg-background-tertiary text-primary px-3 py-1 rounded">*/}
                    {/*  {`Time Left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}*/}
                    {/*</div>*/}

                    {/* Question Display */}
                    <div
                        className={`flex flex-col gap-4 items-center justify-center h-72 w-full mb-[6rem] relative overflow-hidden ${
                            isSpeaking ? 'circles -ml-1' : ''
                        }`}
                    >
                      {/* Background Ripple Effect */}
                      {isSpeaking && (
                          <div className="absolute inset-0 w-72 h-72 mb-20">
                            <div className="circle1"></div>
                            <div className="circle2"></div>
                            <div className="circle3"></div>
                          </div>
                      )}
                    </div>
                    <div
                        className={`flex flex-col gap-4 items-center justify-center h-full w-full px-4 -ml-4 absolute overflow-hidden`}
                    >
                      {/* Image with Ripple Effect */}
                      <div className="relative w-52 h-52 mx-auto ooga">
                        {/* Ripple effect */}
                        <div
                            className={`absolute inset-0 rounded-full bg-blue-400 transition-all ${
                                isSpeaking ? 'animate-pulse-scale' : ''
                            } z-0`}
                        ></div>

                        {/* Image */}
                        <img
                            src="/assets/avantika.jpeg"
                            alt="Avantika"
                            className="relative h-full w-full rounded-full z-10"
                        />
                      </div>

                      {/* Current Question */}
                      <p className="text-text-secondary text-lg text-center">
                        {questionsRef.current[currentQuestionIndex]}
                        {/* <TypingEffect text={(questionsRef.current || [])[currentQuestionIndex] || ''} /> */}
                      </p>
                    </div>
                  </div>
              )}
              <video
                  ref={videoRef}
                  id="webcam"
                  className={`absolute rounded-lg top-0 left-0 w-[calc(100%-4px)] h-[calc(100%-102px)] object-cover z-50 m-0.5 ${interviewStarted && !isSpeaking ? 'opacity-100' : 'opacity-0'}`}
                  autoPlay
                  playsInline
              ></video>
              <div className="p-4 mt-4 w-full flex items-center gap-6 justify-center bg-background-secondary rounded-lg border border-border-primary">
                {!interviewStarted ? (
                    <button
                        onClick={() => {
                          if (cameranotaccessible) {
                            message.warning('Camera is not available!');
                          } else {
                            startInterview();
                          }
                        }}
                        className={`p-3 text-text-primary rounded transition-all ${
                            isQuestionsLoaded ? 'bg-green-600 hover:bg-green-700' : 'opacity-50 cursor-not-allowed bg-gray-400'
                        }`}
                        disabled={!isQuestionsLoaded}
                    >
                      Start Interview
                    </button>
                ) : (
                    <>
                      <p className="w-[57px]"></p>
                      <button
                          onClick={(e) => {
                            e.preventDefault();
                            showConfirmModal();
                          }}
                          className="p-3 text-text-primary rounded transition-all bg-red-500 hover:bg-red-600"
                      >
                        End Interview
                      </button>
                      <button
                          onClick={() => {
                            message.info('You will be assisted shortly.')
                          }}
                          className="p-3 text-text-primary rounded transition-all bg-yellow-500 hover:bg-yellow-600"
                      >
                        Help
                      </button>
                    </>
                )}
              </div>
            </div>

            {/* Modal for confirmation */}
            <Modal
                title={<span style={{ color: '#fff' }}>Confirm End Interview</span>}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Yes, End"
                cancelText="No, Go Back"
                centered
                maskStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Optional: Dimmed overlay effect
                }}
                style={{
                  top: '20%',
                }}
                bodyStyle={{
                  backgroundColor: '#121212',
                  color: '#fff',
                  borderRadius: '8px',
                }}
            >
              <p style={{ color: '#fff' }}>Are you sure you want to end the interview?</p>
            </Modal>

            {/* Add custom styles */}
            <style jsx global>{`
        .ant-modal-content {
          background-color: #121212 !important; /* Ensure modal container is dark */
          border-radius: 8px;
        }

        .ant-modal-header {
          background-color: #121212 !important; /* Header background */
          border-bottom: none; /* Optional: Remove the header border */
        }

        .ant-modal-title {
          color: #fff !important; /* Title color */
        }

        .ant-modal-footer {
          background-color: #121212 !important; /* Footer background */
          border-top: none; /* Optional: Remove footer border */
        }

        .ant-btn {
          border-radius: 4px !important;
        }

        .ant-btn-primary {
          background-color: #1d4ed8 !important; /* Customize the primary button */
          border-color: #1d4ed8 !important;
        }

        .ant-btn-default {
          background-color: #f5f5f5 !important; /* Customize default button */
          color: #000 !important;
        }
      `}</style>

            {/* Second Column (1/3 Width) */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 mb-4 md:mb-auto">
              {/*<div className="hidden p-4 md:flex flex-col gap-4 justify-center bg-background-secondary rounded-lg border border-border-primary">*/}
              {/*  <h2 className="text-2xl font-semibold text-text-primary">{taskDetails.header.title.slice(0, taskDetails.header.title.indexOf('at'))}</h2>*/}
              {/*  <h2 className="text-md font-medium text-text-secondary">{taskDetails.header.title.slice(taskDetails.header.title.indexOf('at')+2, taskDetails.header.title.length)}</h2>*/}
              {/*</div>*/}
              <div className="p-4 flex flex-col gap-2 justify-center bg-background-secondary rounded-lg border border-border-primary text-text-secondary">
                <h3 className="font-bold text-text-primary">Welcome to your CHAYAN.AI Video Interview!</h3>
                <p className="">This interview is designed to give us a deeper understanding of your personality. Please ensure you are in a quiet environment with a stable internet connection.</p>
                <h3 className='mt-4 text-text-primary'>Some Quick Tips-</h3>
                <ul className='list-inside list-disc text-text-secondary'>
                  <li className="ml-4">A silence of 5 seconds will take you to next question.</li>
                  <li className="ml-4">Be Yourself, Let your personality shine</li>
                  {/*<li className="ml-4">Dress Professionally</li>*/}
                  <li className="ml-4">Listen Carefully</li>
                  <li className="ml-4">Be Authentic</li>
                </ul>
                <h3 className='mt-4'>{`We understand that this might be a new experience. Please don't hesitate to take a moment to adjust and feel comfortable before you begin.`}</h3>
                <h3 className='mt-1'>{`Click`} <span className="text-text-primary font-semibold">{`"Start Interview"`}</span> {`to proceed`}</h3>
              </div>

            </div>
          </div>
        </div>
      </>
  );
};

export default InterviewPage;
