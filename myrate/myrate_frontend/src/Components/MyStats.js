import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import Table from 'react-bootstrap/Table';

const MyStats = () => {
    let [BookStat, setBookStat] = useState(0);
    let [MovieStat, setMovieStat] = useState(0);
    let [TVStat, setTVStat] = useState(0);

    let [yearly, setYearly] = useState('');
    let [monthly, setMonthly] = useState('');
    let [daily, setDaily] = useState('');
    let [yearlyBookRatings, setYearlyBookRatings] = useState('');
    let [monthlyBookRatings, setMonthlyBookRatings] = useState('');
    let [dailyBookRatings, setDailyBookRatings] = useState('');
    let [yearlyMovieRatings, setYearlyMovieRatings] = useState('');
    let [monthlyMovieRatings, setMonthlyMovieRatings] = useState('');
    let [dailyMovieRatings, setDailyMovieRatings] = useState('');
    let [yearlyTVRatings, setYearlyTVRatings] = useState('');
    let [monthlyTVRatings, setMonthlyTVRatings] = useState('');
    let [dailyTVRatings, setDailyTVRatings] = useState('');
  
    let yearlyGoals = [];
    let monthlyGoals = [];
    let dailyGoals = [];
  

    const [modalOpen, setModalOpen] = useState(false); 
    const userProfile = useSelector((state) => { return state.userProfile; });

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }

    function getPrevMonth(day) {
      let prevMonth = new Date();
      prevMonth.setDate(0);
      prevMonth.setDate(day);
      return prevMonth;
    }
  

    // Fetch Ratings data of this user from the backend
    useEffect(() => {
      axios.get(`http://localhost:5000/rating/findstatrating`, {
        params: {
          username: userProfile.username
        },
      })
        .then(function (response) {
          // set stats with user data with data in the response
          var bs = 0;
          var ms = 0;
          var tvs = 0;
          // used to determine if rating occured in last year, week, or today
          let today = new Date();
          let lastYear = today.getFullYear();
          let lastMonth = getPrevMonth(today.getDate());
          
          let byr = 0;
          let bmr = 0;
          let bdr = 0;
          let myr = 0;
          let mmr = 0;
          let mdr = 0;
          let tyr = 0;
          let tmr = 0;
          let tdr = 0;
  
          response.data.map(d => {
            let ratingDate = new Date(d["timestamp_day"]);
            if (d["media_type"] === "books") {
              bs++;
              if(ratingDate.getFullYear() === lastYear)
              {
                byr++;
                if(getPrevMonth(ratingDate.getDate()) <= lastMonth)
                {
                  bmr++;
                  if(ratingDate.getDate() === today.getDate() && ratingDate.getMonth() === today.getMonth() && ratingDate.getFullYear() === today.getFullYear())
                  {
                    bdr++;
                  }
                }
              }
            } else if (d["media_type"] === "movies") {
              ms++;
              if (ratingDate.getFullYear() === lastYear) {
                myr++;
                if (getPrevMonth(ratingDate.getDate()) <= lastMonth) {
                  mmr++;
                  if (ratingDate.getDate() === today.getDate() && ratingDate.getMonth() === today.getMonth() && ratingDate.getFullYear() === today.getFullYear()) {
                    mdr++;
                  }
                }
              }
            } else {
              tvs++;
              if (ratingDate.getFullYear() === lastYear) {
                tyr++;
                if (getPrevMonth(ratingDate.getDate()) <= lastMonth) {
                  tmr++;
                  if (ratingDate.getDate() === today.getDate() && ratingDate.getMonth() === today.getMonth() && ratingDate.getFullYear() === today.getFullYear()) {
                    tdr++;
                  }
                }
              }
            }
          });
  
          setBookStat(bs);
          setMovieStat(ms);
          setTVStat(tvs);
  
          setDailyBookRatings(bdr);
          setMonthlyBookRatings(bmr);
          setYearlyBookRatings(byr);
  
          setDailyMovieRatings(mdr);
          setMonthlyMovieRatings(mmr);
          setYearlyMovieRatings(myr);
  
          setDailyTVRatings(tdr);
          setMonthlyTVRatings(tmr);
          setYearlyTVRatings(tyr);
        });
  
    }, [userProfile]);

    const data = [
      {
        media: "Book",
        minutes: BookStat * 600
      },
      {
        media: "Movie",
        minutes: MovieStat * 110
      },
      {
        media: "TV Show",
        minutes: TVStat * 16 * 40
      }
    ];
  

    const MyResponsiveBar = () => (
      <ResponsiveBar
      data={data}
      keys={["minutes"]}
      indexBy="media"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      colors={{ scheme: 'nivo' }}
      animate={true}
      enableLabel={false}
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "minutes",
        legendPosition: "middle",
        legendOffset: -40
      }}

      />
  )

  const pieData = [
    {
      id: "Books",
      label: "Books",
      value: BookStat,
      color: "hsl(90, 70%, 50%)"
    },
    {
      id: "Movie",
      label: "Movie",
      value: MovieStat,
      color: "hsl(56, 70%, 50%)"
    },
    {
      id: "TV Show",
      label: "TV Show",
      value: TVStat,
      color: "hsl(103, 70%, 50%)"
    }
  ];

  const Pie = () => (
    <ResponsivePie
      data={pieData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
    />
  )



    return (
        <><Table striped bordered hover size="sm">
        <thead>
        <tr>
          <th>Media Type</th>
          <th>#</th>
          <th>Total Time</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Book</td>
          <td>{BookStat}</td>
          <td>{BookStat * 600} mins!</td>
        </tr>
        <tr>
          <td>Movies</td>
          <td>{MovieStat}</td>
          <td>{MovieStat * 110} mins!</td>
        </tr>
        <tr>
          <td>TV Shows</td>
          <td>{TVStat}</td>
          <td>{TVStat * 16 * 40} mins!</td>
        </tr>
      </tbody>
        </Table><><dl>
            <dt><strong>Books</strong></dt>
            <dd><li><i>Amount of Books Read: {BookStat}</i></li></dd>
            <dd><li><i>Time Spent Reading: {BookStat * 600} mins!</i></li></dd>
            <dt><strong>Movies</strong></dt>
            <dd><li><i>Amount of Movies Watched: {MovieStat}</i></li></dd>
            <dd><li><i>Time Spent Watching Movies: {MovieStat * 110} mins!</i></li></dd>
            <dt><strong>TV Shows</strong></dt>
            <dd><li><i>Amount of TV Shows Watched: {TVStat}</i></li></dd>
            <dd><li><i>Time Spent Watching TV Shows: {TVStat * 16 * 40} mins!</i></li></dd>
        </dl>
                <div style={{ height: 400, width: '70%', display: 'inline-flex' }}>
                    {MyResponsiveBar()}
                </div>
                <div style={{ height: 400, width: '30%', display: 'inline-flex' }}>
                    {Pie()}
                </div></></>

    )
}


export default MyStats;