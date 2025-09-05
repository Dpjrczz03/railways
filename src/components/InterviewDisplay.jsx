"use client"
import React, { useState, useEffect, useRef } from "react"
import InterviewLog from "./InterviewLog"
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios"
import { Link, Copy, Disc } from "lucide-react"
import { message } from "antd"

const InterviewDisplay = ({ jobs, profile, dataarr, setdataarr }) => {
	const [selectedJob, setSelectedJob] = useState(jobs[0])
	const [dataSelected, setDataSelected] = useState(0)
	const [sortSelected, setSortSelected] = useState(0)
	const [filterSelected, setFilterSelected] = useState(0)
	const [stageSelected, setStageSelected] = useState(0)
	const [loaderskill, setLoader] = useState(false)
	const [skills, setSkills] = useState([])
	const [linkid, setLinkid] = useState()
	const [applicants, setApplicants] = useState([])
	const [load, setload] = useState(false)
	const [jobexists, setjobexists] = useState(false)
	const [isRecording, setIsRecording] = useState(false);
	const videoRef = useRef(null);
	const [stream, setStream] = useState(null);
	// const [updater, setupdater] = useState(0)


	const handleRecordingStart = () => setIsRecording(true);
  const handleRecordingStop = () => setIsRecording(false);


	const [applicationData, setApplicationData] = useState({
		applied: applicants.length,
		assessment: applicants.filter((item) => item.role_fitment_score).length,
		ai_interview: applicants.filter((item) => item.interview_score).length,
		shortlisted: applicants.filter((item) => item.status === "shortlisted")
			.length,
	})

	const parseText = (text) => {
		const lines = text.split("\n").filter((line) => line.trim() !== "")

		const elements = []
		let currentList = []

		lines.forEach((line) => {
			// Bold the headings (##) and display them as bold and large text
			if (line.startsWith("## ")) {
				if (currentList.length) {
					elements.push(
						<ul className='list-disc list-inside pl-6 space-y-1'>
							{currentList}
						</ul>
					)
					currentList = []
				}
				elements.push(
					<h2 className='font-bold text-lg mt-4'>{line.replace("## ", "")}</h2>
				)
			}
			// Semibold for subheadings with double asterisks (**)
			else if (line.startsWith("**") && line.endsWith("**")) {
				if (currentList.length) {
					elements.push(
						<ul className='list-disc list-inside pl-6 space-y-1'>
							{currentList}
						</ul>
					)
					currentList = []
				}
				elements.push(
					<strong className='block font-semibold mt-4'>
						{line.replace(/\*\*/g, "")}
					</strong>
				)
			}
			// Handle bullet points
			else if (line.startsWith("*")) {
				const innerLine = line.replace(/\*\*(.*?)\*\*/, "<strong>$1</strong>")
				currentList.push(
					<li
						className='pl-2'
						dangerouslySetInnerHTML={{ __html: innerLine.replace("* ", "") }}
					></li>
				)
			}
			// Handle normal text
			else {
				if (currentList.length) {
					elements.push(
						<ul className='list-disc list-inside pl-6 space-y-1'>
							{currentList}
						</ul>
					)
					currentList = []
				}
				elements.push(<p className='mt-2'>{line}</p>)
			}
		})

		if (currentList.length) {
			elements.push(
				<ul className='list-disc list-inside pl-6 space-y-1'>{currentList}</ul>
			)
		}

		return elements
	}

	const formatDate = (date) => {
		const day = String(date.getDate()).padStart(2, "0")
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const year = date.getFullYear()
		return `${day}/${month}/${year}`
	}

	const currentDate = new Date()

	const generateDates = (numPrevious, numNext) => {
		const dates = []
		for (let i = numPrevious; i > 0; i--) {
			const previousDate = new Date()
			previousDate.setDate(currentDate.getDate() - i)
			dates.push({ date: previousDate, future: false })
		}
		dates.push({ date: currentDate, isToday: true })
		for (let i = 1; i <= numNext; i++) {
			const nextDate = new Date()
			nextDate.setDate(currentDate.getDate() + i)
			dates.push({ date: nextDate, future: true })
		}
		return dates
	}

	const dates = generateDates(5, 5)

	useEffect(() => {
		if (jobs.length > 0) {
			setjobexists(true)
		}
	}, [])

	useEffect(() => {
		;(async () => {
			if (jobs && jobs.filter((item) => item.status === "active").length > 0) {
				const firstJob = jobs.filter((item) => item.status === "active")[0]
				if (firstJob) {
					setSelectedJob(firstJob)
					if (jobs.length > 0) {
						await axios
							.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/getskillsbyid`, {
								job_id: firstJob.job_id,
							})
							.then((res) => {
								setSkills(res.data)
								// console.log(res.data)
							})
					}
				}
			} else if (jobs && jobs.length > 0) {
				const firstJob = jobs[0]
				if (firstJob) {
					setSelectedJob(firstJob)
					if (jobs.length > 0) {
						await axios
							.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/getskillsbyid`, {
								job_id: firstJob.job_id,
							})
							.then((res) => {
								setSkills(res.data)
								// console.log(res.data)
							})
					}
				}
			}
		})()

		// console.log("skills",skills)
	}, [])

	useEffect(() => {
		// console.log(selectedJob)
		if (jobs.length > 0) {
			if (selectedJob.status === "active") {
				setLinkid(selectedJob.job_id)
			} else {
				setLinkid(null)
			}
		}
	}, [selectedJob])
	useEffect(() => {
		;(async () => {
			if (jobs.length > 0) {
				await axios
					.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/applicationsnew`, {
						job_id: selectedJob.job_id,
					})
					.then(async (res) => {
						// setApplicants(res.data)
						// console.log("dfdsaf")
						let a = []
						await Promise.all(
							res.data.map(async (item) => {
								// console.log(item)
								await axios
									.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/get/findbyId`, {
										userId: item.user_id,
									})
									.then(async (res1) => {
										await axios
											.post(
												`${process.env.NEXT_PUBLIC_APP_API_IP}/user/getprofilebyId`,
												{ user_id: res1.data.id }
											)
											.then((res2) => {
												a.push({
													name: res1.data.username,
													...item,
													gender: res2.data.gender,
												})
											})
										// console.log(res1.data)
									})
							})
						)
						// console.log("a", a)
						setApplicants(a)
						setApplicationData({
							applied: a.length,
							assessment: a.filter((item) => item.role_fitment_score).length,
							ai_interview: a.filter((item) => item.interview_score).length,
							shortlisted: a.filter((item) => item.status === "shortlisted")
								.length,
						})
					})
			}
			setload(true)
		})()
	}, [selectedJob])

	useEffect(() => {
		;(async () => {
			setLoader(false)
			// console.log(selectedJob.job_id)
			if (jobs.length > 0) {
				await axios
					.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/getskillsbyid`, {
						job_id: selectedJob.job_id,
					})
					.then((res) => {
						setSkills(res.data)
						// console.log(res.data)
					})
			}

			setLoader(true)
		})()
	}, [selectedJob])

	// Access the user's webcam and display it in the video element
	useEffect(() => {
		const getCameraStream = async () => {
		  try {
			const stream = await navigator.mediaDevices.getUserMedia({
			  video: true,
			  audio: false,
			});
			setStream(stream);
			if (videoRef.current) {
			  videoRef.current.srcObject = stream;
			}
		  } catch (error) {
			console.error("Error accessing webcam:", error);
		  }
		};
	
		getCameraStream();
	
		return () => {
		  // Cleanup the stream on component unmount
		  if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		  }
		};
	  }, []);

	// Filter out any undefined jobs
	const validJobs = jobs.filter((job) => job !== undefined)

	return (
		<div>
			<div className='bg-white border border-gray-300 py-8 lg:px-8'>
				<div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
					{/* First Column: Jobs Listing (25%) */}
					<div className='hidden lg:block col-span-1 lg:col-span-1 overflow-y-auto h-[calc(100vh-8rem)] border-r border-gray-300 pr-4'>
						<div className='text-md font-bold w-full mb-4 text-center text-black'>
							History
						</div>

						<div className='flex flex-col items-center mt-20'>
							{dates.map((dateObj, index) => (
								<div
									key={index}
									className={`text-sm font-semibold py-2 ${
										dateObj.isToday
											? "text-blue-500"
											: dateObj.future
											? "text-gray-400"
											: "text-black"
									}`}
								>
									{formatDate(dateObj.date)} {dateObj.future ? <></> : <span className="text-black py-1 px-4 rounded-md bg-green-500">Fit</span>}
								</div>
							))}
						</div>
					</div>

					{/* Second Column: Job Details Part 1 (50%) */}
					<div className='col-span-1 lg:col-span-2 bg-white px-4 border-r border-gray-300'>
						<div className='text-md font-bold w-full mb-4 text-center text-black'>
							CHAYAN.AI – Your AI Interview Tracker
							{/* add a video camera and a start  recording and stop button */}
						</div>
						<div className="flex flex-col items-center">
            			  {/* Camera Preview */}
            			  <div className="w-full max-w-lg bg-gray-100 border border-gray-300 rounded-md p-2">
            			    <video
            			      ref={videoRef}
            			      autoPlay
            			      muted
            			      playsInline
            			      className="w-full h-auto"
            			    />
            			  </div>
            			  {/* Video Recording Controls */}
            			  <ReactMediaRecorder
            			    video
            			    render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            			      <>
            			        <div className="flex space-x-4 mt-4">
            			          <button
            			            onClick={() => {
            			              startRecording();
            			              setIsRecording(true);
            			            }}
            			            className="px-4 py-2 rounded-md bg-green-500 text-white font-bold"
            			          >
            			            Start Recording
            			          </button>
            			          <button
            			            onClick={() => {
            			              stopRecording();
            			              setIsRecording(false);
            			            }}
            			            className="px-4 py-2 rounded-md bg-red-500 text-white font-bold"
            			          >
            			            Stop Recording
            			          </button>
            			        </div>
            			        {mediaBlobUrl && (
            			          <video
            			            src={mediaBlobUrl}
            			            controls
            			            className="mt-4 w-full max-w-lg"
            			          />
            			        )}
            			      </>
            			    )}
            			  />
            			</div>
					</div>

					{/* Third Column: Job Details Part 2 (25%) */}
					<div className='col-span-1 lg:col-span-1 bg-white text-black p-4'>
					  <h2>Skills Assessed for Job Readiness:</h2>
					  <ul className="list-disc list-inside text-md">
					    <li>Alertness and Focus</li>
					    <li>Mental Agility</li>
					    <li>Fatigue Management</li>
					    <li>Situational Awareness</li>
					    <li>Stress Management</li>
					  </ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default InterviewDisplay
