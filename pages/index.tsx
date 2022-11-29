import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { apiKey } from '../apiconfig'
import { useEffect, useState, CSSProperties, useRef } from 'react'
import axios from "axios"
import {format, isBefore, differenceInDays, isEqual } from "date-fns"
import type { Response, Asteroid } from '../utils/types'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BeatLoader } from 'react-spinners'

const override: CSSProperties = {
  display: "block",
  margin: "3em auto"
}

export const DetailsPopup = ({details, setShowDetails} : any) => {

  return (
    <div className={styles.details_overlay}>
      <div className={styles.details_container}>
        <span className={styles.details_name}>{details.item.name} on {details.present.close_approach_date}</span>
        <span className={styles.details_hazard}>{details.item.is_potentially_hazardous_asteroid ? "Hazardous" : "Not hazardous"}, {details.item.is_sentry_object ? "Sentry" : "Not sentry"}</span>
        <span>Previous approaches:</span>
        <ul className={styles.details_datelist}>
          {details?.past.map((item : any) => (
            <li>
              {item.close_approach_date}
            </li>
          ))}
        </ul>
        <span>Next approaches:</span>
        <ul className={styles.details_datelist}>
          {details?.future.map((item : any) => (
            <li>
              {item.close_approach_date}
            </li>
          ))}
        </ul>
      </div>
      <div onClick={() => setShowDetails(false)} className={styles.clickable_overlay}></div>
    </div>
  )
}

export default function Home({setLoggedIn} : any) {
  const [data, setData] = useState<Asteroid[] | null>()
  const [startIndex, setStartIndex] = useState<number>(0)

  const [startDate, setStartDate] = useState<any>(new Date())
  const [endDate, setEndDate] = useState<any>(new Date())

  const [loading, setLoading] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [detailsData, setDetailsData] = useState<any>()

  useEffect(() => {
    if(isBefore(endDate, startDate)) {
      setEndDate(startDate)
    }
  }, [startDate])
  
  useEffect(() => {
    if(isBefore(endDate, startDate)) {
      setStartDate(endDate)
    }
  }, [endDate])


  const PER_PAGE = 10
  const fetchData = () => {
    if(differenceInDays(endDate, startDate) > 7) {
      alert('Maximum allowed interval is 7 days')
      return
    }
    setLoading(true)
    const formattedStart = format(startDate, "yyyy-MM-dd")
    const formattedEnd = format(endDate, "yyyy-MM-dd")
    axios.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${formattedStart}&end_date=${formattedEnd}&api_key=${apiKey}`)
      .then((res : any) => {
        let asteroidList : Asteroid[] = [];
        const data = res.data.near_earth_objects
        for (let date in data) {
          if(data.hasOwnProperty(date)) {
            data[date].forEach((item : Asteroid) => {
              asteroidList.push(item)
            })    
          }

        }
        setData(asteroidList)
        setLoading(false)
        })
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  const openDetails = (item : Asteroid) => {
    const link = item.links.self
    const selectedDate = item.close_approach_data[0].close_approach_date
    axios.get(link)
      .then((res : any) => {
        console.log(res.data)
        res.data.close_approach_data.map((date:any, index:number) => {
          if(isEqual(new Date(date.close_approach_date), new Date(selectedDate))) {
            let approaches = {
              past : [],
              present: date,
              future : [],
              item: item
            }
            approaches.past = res.data.close_approach_data.slice(index - 5, index)
            approaches.future = res.data.close_approach_data.slice(index + 1, index + 6)
            setDetailsData(approaches)
            setShowDetails(true)
          }
        })
      })
  }

  const disabledNext = data && data.length < startIndex + PER_PAGE ? true : false
  const disabledPrev = startIndex < 0 + PER_PAGE
  const changePage = (next = true) => {
    if(!data) return
    if(next && data.length > startIndex + PER_PAGE) {
      setStartIndex((prev) => prev + PER_PAGE)
    }
    if(!next && startIndex >= 0 + PER_PAGE) {
      setStartIndex((prev) => prev - PER_PAGE)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.title_wrapper}>
        <span className={styles.title}>ASTROIDER</span>
        <span className={styles.subtitle}>Explore the universe</span>
      </div>
      <div className={styles.date_wrapper}>
        <span>Choose dates:</span>
        <div className={styles.datepicker_wrapper}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
              disableFuture
              label="Start date"
              openTo="year"
              views={['year', 'month', 'day']}
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          
          <DatePicker
              disableFuture
              label="End date"
              openTo="year"
              views={['year', 'month', 'day']}
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <button className={styles.submit_btn} type="submit" onClick={fetchData}>Explore</button>
      </div>  
      <BeatLoader loading={loading} size={20} cssOverride={override} />
      {data && !loading && <div className={styles.table_wrapper}>
        <div className={styles.table_controls}>
          <button className={styles.page_btn} onClick={() => changePage(false)} disabled={disabledPrev}>Previous page</button>
          <button className={styles.page_btn} onClick={() => changePage(true)} disabled={disabledNext}>Next page</button>
          <span className={styles.page_index}>Showing {startIndex + 1}-{data.length - startIndex < PER_PAGE ? data.length : startIndex + PER_PAGE} of {data?.length} results</span>
        </div>
        <ul className={styles.table}>
          <li className={styles.table_item}>
              <span>Name</span>
              <span>Approach date</span>
              <span>Diameter</span>
              <span>Hazardous</span>
              <span>Sentry</span>
          </li>
          {data?.map((item : Asteroid, index : number) => {
            if(index < startIndex || index >= startIndex + PER_PAGE) return
            return (
              <li onClick={() => openDetails(item)} key={index} className={styles.table_item}>
                <span>{item.name}</span>
                <span>{item.close_approach_data[0].close_approach_date}</span>
                <span>{item.estimated_diameter.kilometers.estimated_diameter_max} km</span>
                <span>{item.is_potentially_hazardous_asteroid ? "Hazardous" : "Not hazardous"}</span>
                <span>{item.is_sentry_object ? "Sentry" : "Not sentry"}</span>
              </li>
            )
          })}
        
        </ul>
        
      </div>}
      <button onClick={() => setLoggedIn(false)} className={styles.log_out}>Sign out</button>
      {showDetails && <DetailsPopup setShowDetails={setShowDetails} details={detailsData} />}
    </div>
  )
}
