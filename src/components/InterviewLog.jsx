import React, { useEffect, useState } from 'react'
import { BookMarked } from 'lucide-react'
import axios from 'axios'

const InterviewLog = ({ dataarr, setdataarr, setSelectedJob, selectedJob, mainlistings, profile }) => {
  const [listings, setlistings] = useState(mainlistings)
  const [loader, setloader] = useState(false)
  const [load, setload] = useState(false)

  useEffect(() => {
    setlistings(mainlistings)
  }, [])

  const [c, setC] = useState(0)
  const [categoryjob, setcategoryjob] = useState([])

  const [categorySelected, setCategorySelected] = useState(0)

  // useEffect(() => {
  //   (async () => {
  //     setload(true)
  //     await axios
  //       .post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/getjobsbyuserid`, {
  //         user_id: profile.user_id,
  //       })
  //       .then(async (res) => {
  //         setlistings(res.data)
  //         setdataarr(res.data)
  //         setload(false)
  //       })
  //   })()
  // 
  //   if (categorySelected === 0) {
  //     setcategoryjob(listings.filter((item) => item.status === 'active'))
  //   }
  //   if (categorySelected === 1) {
  //     setcategoryjob(listings.filter((item) => item.status === 'drafted'))
  //   }
  //   if (categorySelected === 2) {
  //     setcategoryjob(listings.filter((item) => item.status === 'closed'))
  //   }
  // }, [categorySelected, c])

  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  // async function handlejobclose(job_id) {
  //   await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/closejob`, { job_id })
  // }

  // async function handlejobpublish(job_id) {
  //   await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/publishjob`, { job_id })
  // }

  const [applications, setapplications] = useState([])

  // useEffect(() => {
  //   (async () => {
  //     await axios.post(`${process.env.NEXT_PUBLIC_APP_API_IP}/job/applicationsall`).then(async (res) => {
  //       setapplications(res.data)
  //     })
  //     setloader(true)
  //   })()
  // }, [])

  if (!(load || loader)) {
    return <></>
  } else {
    return (
      <div className="space-y-4">
        { listings
            .filter((item) => item.status === 'drafted')
            .map((listing, index) => {
              const isSelected = selectedJob?.job_role_name === listing.job_role_name
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer ${
                    isSelected
                      ? 'bg-[#F3F8FE] border-[#9DC6FA] dark:bg-gray-700 dark:border-gray-500 border'
                      : 'bg-[#F6F6F6] dark:bg-gray-800'
                  }`}
                  onClick={() => setSelectedJob(listing)}
                >
                  <div className="flex w-full flex-col justify-between items-center">
                    <div className="flex w-full justify-between items-center mb-2">
                      <div>
                        <h4 className="text-lg font-medium text-blue-500">{listing.job_role_name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{profile.company_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</p>
                      </div>
                      <div className="mb-auto mt-1 flex space-x-2">
                        <button
                          onClick={() => {
                            handlejobpublish(listing.job_id)
                            setC((prev) => prev + 1)
                          }}
                          type="button"
                          className="py-1 px-4 border-2 border-blue-600 rounded-lg text-sm font-medium bg-blue-500 text-white"
                        >
                          Publish
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            // Redirect to the edit page, assuming route is `/edit-job/[job_id]`
                            window.location.href = `/edit-job/${listing.job_id}`
                          }}
                          type="button"
                          className="py-1 px-4 border-2 border-green-600 rounded-lg text-sm font-medium bg-green-500 text-white"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    {/* <div className="w-full text-sm text-gray-700 dark:text-gray-300">
                      <p>Sector: {profile.company_sector}</p>
                      <p>Type: {listing.working_type}</p>
                      <p>
                        CTC: ₹{listing.lower_ctc} - ₹{listing.upper_ctc}
                      </p>
                      <p>Travelling: {listing.travelling_required ? 'Yes' : 'No'}</p>
                      <p>Applied: {applications.filter((item) => item.job_id === listing.job_id).length}</p>
                      <p>Last Date: {convertDateToDDMMYYYY(listing.last_date)}</p>
                    </div> */}
                  </div>
                </div>
              )
            })}
      </div>
    )
  }
}

export default InterviewLog
