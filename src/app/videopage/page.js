// components/InterviewPage.js
'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const InterviewPage = ({ prompt }) => {
    const router = useRouter()
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [questions, setQuestions] = useState(["Hi Ankit, what’s your favorite way to spend your free time when you’re at home?","What’s one thing about Jabalpur that you really miss while working in Mumbai?","Tell us something fun about your kids, Ayan and Rahul—what keeps them the most entertained?","If you could pick any place for your next holiday, where would you go and why?","What’s the best memory you’ve had on the job as a loco pilot so far?"]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isQuestionsLoaded, setIsQuestionsLoaded] = useState(true);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const timerId = useRef(null);

    // Transcript States
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [totalTranscript, setTotalTranscript] = useState('');

    // Video Recording States
    const mediaRecorderRef = useRef(null);
    const currentQuestionIndexRef = useRef(0);
    const videoChunks = useRef([]);
    const [isUploading, setIsUploading] = useState(false);
    const [userId, setUserId] = useState();
    const [loader, setLoader] = useState(true);

    // Speech Recognition Ref
    const recognitionRef = useRef(null);

    // Silence Timeout Ref
    const silenceTimeoutRef = useRef(null);

    const userIdRef = useRef();

useEffect(() => {
    (async () => {
        if (loader) {
            const token = localStorage.getItem('jwt_token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_auth/verify`, { token });
                userIdRef.current = res.data.id; // Persist userId in useRef
                setUserId(res.data.id);
            } catch (err) {
                console.error(err);
                if (err.response.status === 401) {
                    localStorage.removeItem('jwt_token');
                    router.push('/login');
                } else {
                    alert(err.response.data);
                }
            }

            setLoader(false);
        }
    })();
}, [router, loader]);

    // Effect to fetch questions on mount
    // useEffect(() => {
    //     const fetchQuestions = async () => {
    //         try {
    //             const response = await axios.post('/api/proxy', { prompt });
    //             console.log('Fetched questions:', response.data);
    //             setQuestions(response.data);
    //             setIsQuestionsLoaded(true);
    //         } catch (error) {
    //             console.error('Error fetching questions:', error);
    //         }
    //     };
    //
    //     fetchQuestions();
    // }, [prompt]);

    // Effect to set up Speech Recognition
    useEffect(() => {
        console.log('Setting up Speech Recognition...');
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
            alert('Your browser does not support Speech Recognition API. Please use Chrome or Firefox.');
            console.log('SpeechRecognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Set to desired language

        // Event Handlers
        recognition.onstart = () => {
            console.log('Speech recognition started.');
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptSegment = event.results[i][0].transcript.trim();
                const confidence = event.results[i][0].confidence;

                console.log(`Transcript Segment: "${transcriptSegment}", Confidence: ${confidence}`);

                if (event.results[i].isFinal && confidence > 0.6) {
                    final += transcriptSegment + ' ';
                } else {
                    interim += transcriptSegment + ' ';
                }
            }

            setCurrentTranscript(interim);
            setTotalTranscript((prev) => prev + final);

            // Reset silence timeout
            resetSilenceTimeout();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                alert('Microphone access is denied. Please allow microphone access.');
                stopSpeechRecognition();
            } else {
                // Attempt to restart recognition
                console.log('Attempting to restart speech recognition after error...');
                recognition.stop();
                setTimeout(() => {
                    startSpeechRecognition();
                }, 1000);
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended.');
            if (interviewStarted) {
                console.log('Restarting speech recognition...');
                startSpeechRecognition();
            }
        };

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up Speech Recognition...');
            recognition.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewStarted]);

    // Function to start speech recognition
    const startSpeechRecognition = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                console.log('Speech recognition started via startSpeechRecognition.');
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    };

    // Function to stop speech recognition
    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            console.log('Speech recognition stopped via stopSpeechRecognition.');
        }
    };

    // Function to reset silence timeout
    const resetSilenceTimeout = () => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = setTimeout(() => {
            console.log('Silence detected. Stopping speech recognition.');
            stopSpeechRecognition();
            proceedToNextQuestion();
        }, 5000); // 5 seconds of silence
    };
    // Function to proceed to the next question
    const proceedToNextQuestion = async () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            stopVideoRecording(); // Stop current video recording
            await uploadVideoSegment(); // Wait for video upload
        }
        // console.log("call hua")
    
        setCurrentQuestionIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
    
            if (nextIndex < questions.length) {
                // Stop Speech Recognition during transition
                stopSpeechRecognition();
    
                // Speak the next question
                speakQuestion(questions[nextIndex]).then(() => {
                    // Restart Speech Recognition after the question is spoken
                    startSpeechRecognition();
                    startVideoRecording(); // Start video recording for the next question
                });
            } else {
                console.log('All questions have been asked.');
                alert('Interview completed. Thank you!');
                stopSpeechRecognition();
                setInterviewStarted(false);
                clearInterval(timerId.current);
            }
            currentQuestionIndexRef.current = nextIndex;
    
            return nextIndex; // Ensure state is updated correctly
        });
    };
    
    
    

    // Function to handle starting the interview
    const startInterview = () => {
        setInterviewStarted(true); // Start the interview session
        setTimeLeft(180); // Reset the timer to 3 minutes
        speakQuestion(questions[0]); // Speak the first question
        startVideoRecording(); // Begin video recording
        startTimer(); // Start countdown timer
        startSpeechRecognition(); // Enable speech recognition
    };

    // Function to speak a question
    const speakQuestion = async (question) => {
        console.log(`Speaking question: "${question}"`);
        try {
            const audioUrl = await synthesizeSpeech(question);
            if (audioUrl) {
                const audio = new Audio(audioUrl);
                return new Promise((resolve, reject) => {
                    audio.play();
                    audio.onended = () => {
                        console.log('Finished speaking the question.');
                        resolve(); // Resolve the promise when the audio finishes
                    };
                    audio.onerror = (err) => {
                        console.error('Error playing audio:', err);
                        reject(err);
                    };
                });
            }
        } catch (error) {
            console.error('Error in speakQuestion:', error);
        }
    };
    

    // Function to synthesize speech
    const synthesizeSpeech = async (text) => {
        try {
            const response = await axios.post(
                'api/synthesizeSpeech',
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

    // Function to start the countdown timer
    const startTimer = () => {
        if (timerId.current) {
            clearInterval(timerId.current);
        }

        timerId.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerId.current);
                    alert('Time is up for this question.');
                    stopSpeechRecognition();
                    proceedToNextQuestion();
                    return 0;
                }
            });
        }, 1000);
    };

    // Effect to set up video stream
    useEffect(() => {
        const setupVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.muted = true; // Mute to prevent echo
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        setupVideoStream();
    }, []);

    // Function to start video recording
    const startVideoRecording = () => {
        if (!videoRef.current || !videoRef.current.srcObject) {
            console.error('Video stream not available.');
            return;
        }

        const stream = videoRef.current.srcObject;
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = mediaRecorder;
        videoChunks.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
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
        
                // Optional: Create a download link (for debugging or manual verification)
                // const videoUrl = URL.createObjectURL(videoBlob);
                // const a = document.createElement('a');
                // a.style.display = 'none';
                // a.href = videoUrl;
                // a.download = `video-segment-${Date.now()}.webm`;
                // document.body.appendChild(a);
                // a.click();
                // URL.revokeObjectURL(videoUrl);
            }
        };

        mediaRecorder.onerror = (error) => {
            console.error('MediaRecorder error:', error);
        };

        mediaRecorder.start();
        console.log('Video recording started.');
    };

    const stopVideoRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            console.log('Stopping video recording...');
        } else {
            console.warn('MediaRecorder is not recording.');
        }
    };

    // Function to upload video segment
    const uploadVideoSegment = async (videoBlob, questionIndex) => {
        console.log("Initiating video upload...");
    
        if (!videoBlob) {
            console.error("No videoBlob provided for upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append('video', videoBlob, `question_${questionIndex}.webm`);
        formData.append('questionNumber', questionIndex);
        formData.append('user_id', userIdRef.current);
    
        try {
             await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/loco_video/upload`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then((response)=>{


                 if (response.status===201) {
                     console.log(`Video for question ${questionIndex} uploaded successfully.`);
                 } else {
                     console.error(
                         `Failed to upload video for question ${questionIndex}. Response: ${response.status}, ${response.statusText}`
                     );
                 }
             });
    

        } catch (error) {
            console.error(`Error during video upload for question ${questionIndex}:`, error);
        }
    };
    
    
    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (timerId.current) {
                clearInterval(timerId.current);
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
            }
            stopSpeechRecognition();
        };
    }, []);


    if(loader){
        return(<></>)
    }

    return (
        <div className="p-4">
            <div className="flex gap-4">
                {/* First Column (2/3 Width) */}
                <div className="w-2/3 flex flex-col items-center">
                    {!interviewStarted ? (
                        <button
                            onClick={startInterview}
                            className={`px-6 py-3 bg-blue-500 text-white rounded ${isQuestionsLoaded ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={!isQuestionsLoaded}
                        >
                            {isQuestionsLoaded ? 'Begin Interview' : 'Loading Questions...'}
                        </button>
                    ) : (
                        <div className="relative flex flex-col justify-center border rounded-lg bg-black h-full w-full p-4">
                            {/* Timer */}
                            <div className="absolute top-2 left-2 bg-white text-red-500 px-3 py-1 rounded">
                                {`Time Left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}
                            </div>

                            {/* Question Display */}
                            <div className="flex items-center justify-center h-full">
                                <p className="text-white text-xl text-center">{questions[currentQuestionIndex]}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Second Column (1/3 Width) */}
                <div className="w-1/3 flex flex-col gap-4">
                    {/* Candidate Information */}
                    <div className="p-4 border border-gray-300 rounded-lg bg-white">
                        <h3 className="text-xl font-semibold mb-2">Candidate Information</h3>
                        <p>Name: Amit Malakar</p>
                        <p>Degree: B. Tech, Chemical Engineering</p>
                        <p>Institute: IIT Roorkee</p>
                        <p>Duration: 15 minutes</p>
                        <button
                            onClick={proceedToNextQuestion}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Next Question
                        </button>
                    </div>

                    {/* Interview Video */}
                    <div className="p-4 border border-gray-300 rounded-lg bg-white">
                        <h3 className="text-xl font-semibold mb-2">Interview Video</h3>
                        <video
                            ref={videoRef}
                            id="webcam"
                            className="w-full h-60 object-cover mb-2"
                            autoPlay
                            playsInline
                        ></video>
                        <canvas ref={canvasRef} className="w-full h-full"></canvas>
                        {/* Video Recording Controls */}
                        <div className="flex justify-between mt-2">
                            <button
                                onClick={startVideoRecording}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                disabled={isUploading}
                            >
                                Start Recording
                            </button>
                            <button
                                onClick={stopVideoRecording}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                disabled={isUploading}
                            >
                                Stop Recording
                            </button>
                        </div>
                        {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading video...</p>}
                    </div>
                </div>
            </div>

            {/* Transcript Area */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">Transcripts</h2>
                <div className="flex flex-col gap-4">
                    {/* Current Session Transcript */}
                    <div>
                        <label htmlFor="current-transcript" className="block text-sm font-medium text-gray-700">
                            Current Session Transcript:
                        </label>
                        <textarea
                            id="current-transcript"
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            value={currentTranscript}
                            onChange={(e) => setCurrentTranscript(e.target.value)}
                            placeholder="Listening..."
                            readOnly
                        ></textarea>
                    </div>

                    {/* Total Transcript */}
                    <div>
                        <label htmlFor="total-transcript" className="block text-sm font-medium text-gray-700">
                            Total Transcript:
                        </label>
                        <textarea
                            id="total-transcript"
                            rows={10}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            value={totalTranscript}
                            onChange={(e) => setTotalTranscript(e.target.value)}
                            placeholder="This will capture the full session."
                            readOnly
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
