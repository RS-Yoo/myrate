import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

// Chart imports
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';

// Sidebar goal imports
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import GoalPopUp from './GoalPopUp';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Tooltip from "@material-ui/core/Tooltip";

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

  function getPrevYear() {
    let now = new Date();
    let newMil = now.getMilliseconds() - 31556952000; // subtract amount of milliseconds in a week from curr milliseconds
    return new Date(newMil);
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

  useEffect(() => {
    axios.get(`http://localhost:5000/goal/findstatgoal`, {
      params: {
        username: userProfile.username
      },
    })
      .then(function (response) {
        response.data.map(d => {
          if (d["daymonthyear"] === "Yearly") {
            yearlyGoals.push(d);
          } else if (d["daymonthyear"] === "Monthly") {
            monthlyGoals.push(d);
          } else {
            dailyGoals.push(d);
          }
        });
        setYearly(yearlyGoals);
        setMonthly(monthlyGoals);
        setDaily(dailyGoals);

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

  const Bar = () => {
    return (
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
    );
  };

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

  const Pie = () => {
    return (
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
    );
  };

  function returnDailyGoals(goals) {
    console.log(JSON.stringify(goals));
    try {
      let goalSats = [];
      goals.map(function (g) {
        let varColor = "success";
        let nowNum = 0;
        let ttstr = "";
        if (g.measurement === "MCount") {
          if (g.mediaType === "Books")
          {
            nowNum = dailyBookRatings / g.amount;
            ttstr = "Read " + dailyBookRatings + " books out of " + g.amount;
          }
          else if (g.mediaType === "Movies")
          {
            nowNum = dailyMovieRatings / g.amount;
            ttstr = "Watched " + dailyMovieRatings + " movies out of " + g.amount;
          }
          else
          {
            nowNum = dailyTVRatings / g.amount;
            ttstr = "Watched " + dailyTVRatings + " shows out of " + g.amount;
          }
          nowNum *= 100;
          if (nowNum < 33)
            varColor = "danger"
          else if (nowNum < 66)
            varColor = "warning"
          goalSats.push(<>
            <p style={{backgroundColor: "lightcyan"}}>{g.goalTitle} ( {g.mediaType} )</p>
            <Tooltip title={ttstr}>
              <ProgressBar striped animated variant={varColor} now={nowNum} />
            </Tooltip>
          </>);
        }
      });

      return (
        <div>
          {goalSats}
        </div>
      )
    }
    catch {

    }
  }

  function returnMonthlyGoals(goals) {
    console.log(JSON.stringify(goals));
    try {
      let goalSats = [];
      goals.map(function (g) {
        let varColor = "success";
        let nowNum = 0;
        let ttstr = "";
        if (g.measurement === "MCount") {
          if (g.mediaType === "Books")
          {
            nowNum = monthlyBookRatings / g.amount;
            ttstr = "Read " + monthlyBookRatings + " books out of " + g.amount;
          }
          else if (g.mediaType === "Movies")
          {
            nowNum = monthlyMovieRatings / g.amount;
            ttstr = "Watched " + monthlyMovieRatings + " movies out of " + g.amount;
          }
          else
          {
            nowNum = monthlyTVRatings / g.amount;
            ttstr = "Watched " + monthlyTVRatings + " shows out of " + g.amount;
          }
          nowNum *= 100;
          if (nowNum < 33)
            varColor = "danger"
          else if (nowNum < 66)
            varColor = "warning"
          goalSats.push(<>
            <p style={{backgroundColor: "lightcyan"}}>{g.goalTitle} ( {g.mediaType} )</p>
            <Tooltip title={ttstr}>
              <ProgressBar striped animated variant={varColor} now={nowNum} />
            </Tooltip>
          </>);
        }
      });

      return (
        <div>
          {goalSats}
        </div>
      )
    }
    catch {

    }
  }

  function returnYearlyGoals(goals) {
    console.log(JSON.stringify(goals));
    try {
      let goalSats = [];
      goals.map(function (g) {
        let varColor = "success";
        let nowNum = 0;
        let ttstr = "";
        if (g.measurement === "MCount") {
          if (g.mediaType === "Books")
          {
            nowNum = yearlyBookRatings / g.amount;
            ttstr = "Read " + yearlyBookRatings + " books out of " + g.amount;
          }
          else if (g.mediaType === "Movies")
          {
            nowNum = yearlyMovieRatings / g.amount;
            ttstr = "Watched " + yearlyMovieRatings + " movies out of " + g.amount;
          }
          else
          {
            nowNum = yearlyTVRatings / g.amount;
            ttstr = "Watched " + yearlyTVRatings + " shows out of " + g.amount;
          }
          nowNum *= 100;
          if (nowNum < 33)
            varColor = "danger"
          else if (nowNum < 66)
            varColor = "warning"
          goalSats.push(<>
            <p style={{backgroundColor: "lightcyan"}}>{g.goalTitle} ( {g.mediaType} )</p>
            <Tooltip title={ttstr}>
              <ProgressBar striped animated variant={varColor} now={nowNum} />
            </Tooltip>
          </>);
        }
      });

      return (
        <div>
          {goalSats}
        </div>
      )
    }
    catch {

    }
  }

  return (
    <>
      <div >
      </div>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <dl style={{ width: '80%' }}>
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
        <ProSidebarProvider style={{ display: "flex", rtl: 'true', flexDirection: "row-reverse", height: '100%' }} rtl={true}>
          <Sidebar>
            <Menu>
              <SubMenu label="Yearly Goals">
                {returnYearlyGoals(yearly)}
              </SubMenu>
              <SubMenu label="Monthly Goals">

                {returnMonthlyGoals(monthly)}
              </SubMenu>
              <SubMenu label="Daily Goals">
                {returnDailyGoals(daily)}
              </SubMenu>
              <MenuItem>
                <GoalPopUp />
              </MenuItem>
            </Menu>
          </Sidebar>
        </ProSidebarProvider>
      </div>
      <div style={{ height: 400, width: '70%', display: 'inline-flex' }}>
        {Bar()}
      </div>
      <div style={{ height: 400, width: '30%', display: 'inline-flex' }}>
        {Pie()}
      </div></>
  )
}


export default MyStats;