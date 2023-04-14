import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

// Imports for charts
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { Calendar, ResponsiveCalendar } from '@nivo/calendar'

// Imports for goal box
import { ProSidebarProvider, Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import NewGoalForm from './NewGoalForm';
import GoalPopUp from './GoalPopUp';
import ProgressBar from 'react-bootstrap/ProgressBar';
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
              console.log("year for book: " + ratingDate.getFullYear());
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

    const Calendar = () => (
      <ResponsiveCalendar
        data={calendarData}
        from="2015-03-01"
        to="2016-07-12"
        emptyColor="#eeeeee"
        colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
            }
        ]}
    />
    )

    function editGoal(goal) {
    // set GoalName, MediaType, TimeGoal, Positive, Amount of state
    console.log("In edit rating");  
    return (
      <Popper position="left center" >
        <div>
          <NewGoalForm state={{ goalDetails: { goal } }} />
        </div>
      </Popper>
    );
    }
    function deleteGoal(id) {
    axios.delete(`http://localhost:5000/goal/delete/${id}`)
    .then(function(response) {
        window.location.reload(false);
    })    
    }

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
            <Tooltip title={ttstr} arrow>
              <ProgressBar striped animated variant={varColor} now={nowNum} />
            </Tooltip>
            <div style={{ display: "flex", flexDirection: "row-reverse", height: '100%' }}>
              <p style={{color: 'blue', cursor: "pointer"}} onClick={() => deleteGoal(g._id)}>Delete &nbsp;</p> 
              <p>&nbsp;|&nbsp;</p>
              <Popper trigger={<p style={{color: 'blue', cursor: "pointer"} }> Edit </p>} position="left center" >
                <div>
                  <NewGoalForm state={{ goalDetails: { g } }}/>
                </div>
              </Popper>
            </div>
          </>
          );
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
            <div style={{ display: "flex", flexDirection: "row-reverse", height: '100%' }}>
              <p style={{color: 'blue', cursor: "pointer"}} onClick={() => deleteGoal(g._id)}>Delete &nbsp;</p> 
              <p>&nbsp;|&nbsp;</p>
              <Popper trigger={<p style={{color: 'blue', cursor: "pointer"} }> Edit </p>} position="left center" >
                <div>
                  <NewGoalForm state={{ goalDetails: { g } }}/>
                </div>
              </Popper>
            </div>
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
            <div style={{ display: "flex", flexDirection: "row-reverse", height: '100%' }}>
              <p style={{color: 'blue', cursor: "pointer"}} onClick={() => deleteGoal(g._id)}>Delete &nbsp;</p> 
              <p>&nbsp;|&nbsp;</p>
              <Popper trigger={<p style={{color: 'blue', cursor: "pointer"} }> Edit </p>} position="left center" >
                <div>
                  <NewGoalForm state={{ goalDetails: { g } }}/>
                </div>
              </Popper>
            </div>
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

    const calendarData = [
      {
        "value": 389,
        "day": "2015-05-11"
      },
      {
        "value": 71,
        "day": "2018-08-07"
      },
      {
        "value": 8,
        "day": "2018-06-18"
      },
      {
        "value": 323,
        "day": "2015-05-21"
      },
      {
        "value": 281,
        "day": "2016-03-06"
      },
      {
        "value": 22,
        "day": "2018-01-16"
      },
      {
        "value": 391,
        "day": "2017-02-09"
      },
      {
        "value": 396,
        "day": "2017-02-15"
      },
      {
        "value": 53,
        "day": "2017-06-16"
      },
      {
        "value": 148,
        "day": "2017-01-09"
      },
      {
        "value": 284,
        "day": "2018-08-08"
      },
      {
        "value": 93,
        "day": "2015-10-05"
      },
      {
        "value": 313,
        "day": "2018-05-14"
      },
      {
        "value": 234,
        "day": "2015-05-23"
      },
      {
        "value": 151,
        "day": "2017-03-15"
      },
      {
        "value": 143,
        "day": "2017-02-24"
      },
      {
        "value": 81,
        "day": "2015-05-03"
      },
      {
        "value": 394,
        "day": "2016-02-17"
      },
      {
        "value": 85,
        "day": "2016-10-04"
      },
      {
        "value": 114,
        "day": "2018-04-24"
      },
      {
        "value": 334,
        "day": "2016-06-03"
      },
      {
        "value": 108,
        "day": "2016-11-04"
      },
      {
        "value": 105,
        "day": "2017-04-12"
      },
      {
        "value": 160,
        "day": "2015-10-12"
      },
      {
        "value": 132,
        "day": "2015-06-17"
      },
      {
        "value": 149,
        "day": "2015-12-25"
      },
      {
        "value": 367,
        "day": "2018-07-24"
      },
      {
        "value": 93,
        "day": "2017-11-09"
      },
      {
        "value": 74,
        "day": "2016-06-12"
      },
      {
        "value": 7,
        "day": "2016-05-16"
      },
      {
        "value": 225,
        "day": "2015-04-14"
      },
      {
        "value": 382,
        "day": "2018-07-23"
      },
      {
        "value": 172,
        "day": "2017-07-10"
      },
      {
        "value": 346,
        "day": "2017-11-06"
      },
      {
        "value": 55,
        "day": "2016-05-07"
      },
      {
        "value": 311,
        "day": "2015-04-10"
      },
      {
        "value": 124,
        "day": "2016-07-16"
      },
      {
        "value": 199,
        "day": "2015-10-01"
      },
      {
        "value": 154,
        "day": "2015-09-20"
      },
      {
        "value": 390,
        "day": "2017-11-25"
      },
      {
        "value": 324,
        "day": "2015-04-30"
      },
      {
        "value": 136,
        "day": "2016-11-09"
      },
      {
        "value": 317,
        "day": "2015-10-27"
      },
      {
        "value": 36,
        "day": "2017-04-24"
      },
      {
        "value": 98,
        "day": "2015-12-12"
      },
      {
        "value": 332,
        "day": "2018-07-26"
      },
      {
        "value": 156,
        "day": "2016-02-29"
      },
      {
        "value": 36,
        "day": "2017-01-04"
      },
      {
        "value": 180,
        "day": "2015-10-06"
      },
      {
        "value": 9,
        "day": "2018-01-27"
      },
      {
        "value": 222,
        "day": "2017-10-10"
      },
      {
        "value": 244,
        "day": "2017-11-27"
      },
      {
        "value": 95,
        "day": "2016-07-02"
      },
      {
        "value": 192,
        "day": "2017-11-08"
      },
      {
        "value": 345,
        "day": "2016-07-06"
      },
      {
        "value": 1,
        "day": "2016-07-14"
      },
      {
        "value": 220,
        "day": "2016-06-13"
      },
      {
        "value": 218,
        "day": "2015-10-25"
      },
      {
        "value": 270,
        "day": "2017-08-15"
      },
      {
        "value": 118,
        "day": "2016-07-28"
      },
      {
        "value": 129,
        "day": "2017-09-08"
      },
      {
        "value": 395,
        "day": "2016-05-21"
      },
      {
        "value": 93,
        "day": "2017-08-21"
      },
      {
        "value": 250,
        "day": "2018-05-10"
      },
      {
        "value": 308,
        "day": "2018-07-09"
      },
      {
        "value": 261,
        "day": "2016-09-09"
      },
      {
        "value": 34,
        "day": "2016-04-08"
      },
      {
        "value": 135,
        "day": "2016-08-07"
      },
      {
        "value": 82,
        "day": "2015-06-18"
      },
      {
        "value": 27,
        "day": "2017-02-08"
      },
      {
        "value": 276,
        "day": "2016-08-10"
      },
      {
        "value": 52,
        "day": "2015-09-14"
      },
      {
        "value": 368,
        "day": "2017-08-28"
      },
      {
        "value": 380,
        "day": "2018-02-15"
      },
      {
        "value": 199,
        "day": "2018-03-16"
      },
      {
        "value": 116,
        "day": "2018-02-23"
      },
      {
        "value": 355,
        "day": "2018-01-18"
      },
      {
        "value": 71,
        "day": "2015-05-01"
      },
      {
        "value": 121,
        "day": "2018-03-28"
      },
      {
        "value": 237,
        "day": "2018-04-06"
      },
      {
        "value": 386,
        "day": "2016-04-12"
      },
      {
        "value": 63,
        "day": "2017-06-07"
      },
      {
        "value": 29,
        "day": "2018-02-08"
      },
      {
        "value": 196,
        "day": "2017-01-05"
      },
      {
        "value": 26,
        "day": "2018-02-28"
      },
      {
        "value": 154,
        "day": "2017-08-10"
      },
      {
        "value": 41,
        "day": "2018-04-03"
      },
      {
        "value": 339,
        "day": "2017-10-14"
      },
      {
        "value": 339,
        "day": "2017-09-28"
      },
      {
        "value": 396,
        "day": "2017-05-02"
      },
      {
        "value": 321,
        "day": "2017-01-18"
      },
      {
        "value": 328,
        "day": "2016-09-10"
      },
      {
        "value": 28,
        "day": "2016-01-06"
      },
      {
        "value": 40,
        "day": "2016-05-06"
      },
      {
        "value": 236,
        "day": "2015-08-29"
      },
      {
        "value": 154,
        "day": "2016-10-21"
      },
      {
        "value": 140,
        "day": "2018-02-19"
      },
      {
        "value": 103,
        "day": "2015-12-02"
      },
      {
        "value": 40,
        "day": "2017-05-31"
      },
      {
        "value": 89,
        "day": "2017-10-17"
      },
      {
        "value": 256,
        "day": "2017-06-11"
      },
      {
        "value": 126,
        "day": "2015-04-27"
      },
      {
        "value": 133,
        "day": "2015-10-17"
      },
      {
        "value": 155,
        "day": "2015-12-17"
      },
      {
        "value": 12,
        "day": "2015-08-20"
      },
      {
        "value": 50,
        "day": "2018-07-15"
      },
      {
        "value": 57,
        "day": "2015-04-08"
      },
      {
        "value": 250,
        "day": "2017-03-14"
      },
      {
        "value": 194,
        "day": "2018-05-28"
      },
      {
        "value": 283,
        "day": "2015-08-06"
      },
      {
        "value": 164,
        "day": "2017-06-27"
      },
      {
        "value": 117,
        "day": "2016-12-10"
      },
      {
        "value": 1,
        "day": "2018-04-16"
      },
      {
        "value": 356,
        "day": "2016-12-22"
      },
      {
        "value": 36,
        "day": "2017-07-02"
      },
      {
        "value": 312,
        "day": "2017-09-26"
      },
      {
        "value": 378,
        "day": "2016-08-21"
      },
      {
        "value": 243,
        "day": "2015-04-06"
      },
      {
        "value": 34,
        "day": "2016-04-03"
      },
      {
        "value": 179,
        "day": "2018-05-26"
      },
      {
        "value": 148,
        "day": "2016-11-27"
      },
      {
        "value": 126,
        "day": "2015-04-01"
      },
      {
        "value": 51,
        "day": "2016-04-24"
      },
      {
        "value": 174,
        "day": "2017-10-01"
      },
      {
        "value": 277,
        "day": "2015-07-20"
      },
      {
        "value": 306,
        "day": "2017-06-26"
      },
      {
        "value": 226,
        "day": "2017-08-09"
      },
      {
        "value": 55,
        "day": "2016-06-09"
      },
      {
        "value": 142,
        "day": "2018-01-09"
      },
      {
        "value": 261,
        "day": "2016-06-25"
      },
      {
        "value": 128,
        "day": "2016-11-20"
      },
      {
        "value": 226,
        "day": "2016-11-25"
      },
      {
        "value": 239,
        "day": "2016-05-18"
      },
      {
        "value": 193,
        "day": "2017-10-20"
      },
      {
        "value": 164,
        "day": "2015-12-06"
      },
      {
        "value": 2,
        "day": "2015-12-14"
      },
      {
        "value": 64,
        "day": "2017-04-30"
      },
      {
        "value": 155,
        "day": "2018-02-04"
      },
      {
        "value": 148,
        "day": "2018-05-03"
      },
      {
        "value": 16,
        "day": "2017-12-18"
      },
      {
        "value": 113,
        "day": "2017-08-16"
      },
      {
        "value": 301,
        "day": "2016-08-28"
      },
      {
        "value": 10,
        "day": "2015-11-28"
      },
      {
        "value": 339,
        "day": "2017-07-27"
      },
      {
        "value": 304,
        "day": "2017-04-07"
      },
      {
        "value": 242,
        "day": "2016-11-10"
      },
      {
        "value": 372,
        "day": "2016-05-17"
      },
      {
        "value": 227,
        "day": "2017-03-18"
      },
      {
        "value": 46,
        "day": "2016-05-31"
      },
      {
        "value": 216,
        "day": "2016-12-27"
      },
      {
        "value": 164,
        "day": "2015-11-17"
      },
      {
        "value": 225,
        "day": "2017-10-18"
      },
      {
        "value": 348,
        "day": "2017-07-21"
      },
      {
        "value": 30,
        "day": "2018-01-28"
      },
      {
        "value": 266,
        "day": "2017-03-16"
      },
      {
        "value": 212,
        "day": "2015-10-07"
      },
      {
        "value": 299,
        "day": "2017-01-31"
      },
      {
        "value": 32,
        "day": "2015-10-02"
      },
      {
        "value": 164,
        "day": "2016-03-29"
      },
      {
        "value": 269,
        "day": "2016-02-16"
      },
      {
        "value": 308,
        "day": "2016-01-22"
      },
      {
        "value": 191,
        "day": "2018-04-11"
      },
      {
        "value": 233,
        "day": "2018-07-06"
      },
      {
        "value": 116,
        "day": "2017-03-29"
      },
      {
        "value": 17,
        "day": "2017-01-22"
      },
      {
        "value": 202,
        "day": "2015-11-01"
      },
      {
        "value": 82,
        "day": "2017-08-04"
      },
      {
        "value": 299,
        "day": "2016-01-10"
      },
      {
        "value": 164,
        "day": "2016-07-01"
      },
      {
        "value": 41,
        "day": "2016-10-18"
      },
      {
        "value": 144,
        "day": "2015-06-14"
      },
      {
        "value": 310,
        "day": "2016-06-20"
      },
      {
        "value": 29,
        "day": "2017-06-10"
      },
      {
        "value": 233,
        "day": "2016-12-21"
      },
      {
        "value": 97,
        "day": "2015-06-23"
      },
      {
        "value": 105,
        "day": "2017-09-03"
      },
      {
        "value": 372,
        "day": "2016-03-27"
      },
      {
        "value": 372,
        "day": "2016-06-16"
      },
      {
        "value": 188,
        "day": "2016-04-23"
      },
      {
        "value": 24,
        "day": "2016-12-30"
      },
      {
        "value": 90,
        "day": "2017-05-18"
      },
      {
        "value": 394,
        "day": "2017-10-16"
      },
      {
        "value": 119,
        "day": "2016-01-26"
      },
      {
        "value": 49,
        "day": "2016-10-26"
      },
      {
        "value": 311,
        "day": "2016-03-25"
      },
      {
        "value": 191,
        "day": "2017-04-06"
      },
      {
        "value": 323,
        "day": "2016-10-10"
      },
      {
        "value": 108,
        "day": "2016-05-11"
      },
      {
        "value": 38,
        "day": "2016-01-01"
      },
      {
        "value": 221,
        "day": "2015-06-21"
      },
      {
        "value": 388,
        "day": "2017-06-03"
      },
      {
        "value": 147,
        "day": "2016-05-04"
      },
      {
        "value": 358,
        "day": "2016-02-04"
      },
      {
        "value": 295,
        "day": "2016-09-02"
      },
      {
        "value": 270,
        "day": "2017-01-23"
      },
      {
        "value": 81,
        "day": "2016-07-26"
      },
      {
        "value": 112,
        "day": "2017-08-30"
      },
      {
        "value": 130,
        "day": "2017-08-05"
      },
      {
        "value": 30,
        "day": "2017-07-04"
      },
      {
        "value": 146,
        "day": "2017-04-16"
      },
      {
        "value": 82,
        "day": "2016-02-14"
      },
      {
        "value": 87,
        "day": "2017-06-09"
      },
      {
        "value": 81,
        "day": "2016-01-29"
      },
      {
        "value": 89,
        "day": "2017-10-15"
      },
      {
        "value": 1,
        "day": "2016-03-19"
      },
      {
        "value": 71,
        "day": "2016-04-19"
      },
      {
        "value": 199,
        "day": "2015-08-28"
      },
      {
        "value": 150,
        "day": "2016-02-25"
      },
      {
        "value": 344,
        "day": "2018-07-16"
      },
      {
        "value": 345,
        "day": "2016-06-07"
      },
      {
        "value": 280,
        "day": "2016-09-19"
      },
      {
        "value": 14,
        "day": "2015-08-31"
      },
      {
        "value": 128,
        "day": "2018-03-12"
      },
      {
        "value": 324,
        "day": "2016-08-01"
      },
      {
        "value": 176,
        "day": "2018-05-21"
      },
      {
        "value": 70,
        "day": "2018-02-10"
      },
      {
        "value": 286,
        "day": "2017-10-25"
      },
      {
        "value": 235,
        "day": "2017-02-17"
      },
      {
        "value": 280,
        "day": "2015-09-15"
      },
      {
        "value": 248,
        "day": "2018-07-29"
      },
      {
        "value": 94,
        "day": "2017-12-01"
      },
      {
        "value": 159,
        "day": "2015-07-26"
      },
      {
        "value": 19,
        "day": "2015-10-24"
      },
      {
        "value": 18,
        "day": "2017-01-06"
      },
      {
        "value": 275,
        "day": "2016-08-18"
      },
      {
        "value": 133,
        "day": "2015-04-05"
      },
      {
        "value": 356,
        "day": "2015-07-10"
      },
      {
        "value": 305,
        "day": "2016-07-12"
      },
      {
        "value": 58,
        "day": "2016-06-08"
      },
      {
        "value": 200,
        "day": "2018-02-25"
      },
      {
        "value": 347,
        "day": "2017-05-14"
      },
      {
        "value": 130,
        "day": "2016-05-15"
      },
      {
        "value": 380,
        "day": "2018-01-12"
      },
      {
        "value": 260,
        "day": "2017-05-27"
      },
      {
        "value": 112,
        "day": "2016-02-28"
      },
      {
        "value": 94,
        "day": "2017-06-23"
      },
      {
        "value": 178,
        "day": "2017-03-06"
      },
      {
        "value": 33,
        "day": "2015-07-18"
      },
      {
        "value": 314,
        "day": "2017-10-06"
      },
      {
        "value": 367,
        "day": "2015-12-13"
      },
      {
        "value": 228,
        "day": "2016-01-20"
      },
      {
        "value": 392,
        "day": "2017-03-05"
      },
      {
        "value": 32,
        "day": "2016-02-23"
      },
      {
        "value": 133,
        "day": "2015-04-13"
      },
      {
        "value": 165,
        "day": "2017-01-14"
      },
      {
        "value": 156,
        "day": "2018-03-04"
      },
      {
        "value": 224,
        "day": "2018-07-12"
      },
      {
        "value": 27,
        "day": "2015-05-30"
      },
      {
        "value": 169,
        "day": "2017-02-21"
      },
      {
        "value": 65,
        "day": "2017-01-10"
      },
      {
        "value": 266,
        "day": "2018-06-19"
      },
      {
        "value": 155,
        "day": "2016-08-02"
      },
      {
        "value": 7,
        "day": "2017-10-05"
      },
      {
        "value": 347,
        "day": "2016-10-23"
      },
      {
        "value": 228,
        "day": "2015-06-22"
      },
      {
        "value": 172,
        "day": "2015-09-25"
      },
      {
        "value": 348,
        "day": "2016-12-31"
      },
      {
        "value": 45,
        "day": "2018-07-03"
      },
      {
        "value": 300,
        "day": "2016-02-21"
      },
      {
        "value": 383,
        "day": "2017-05-04"
      },
      {
        "value": 316,
        "day": "2018-06-11"
      },
      {
        "value": 188,
        "day": "2018-05-01"
      },
      {
        "value": 109,
        "day": "2017-06-22"
      },
      {
        "value": 147,
        "day": "2017-06-01"
      },
      {
        "value": 333,
        "day": "2016-10-13"
      },
      {
        "value": 3,
        "day": "2017-08-11"
      },
      {
        "value": 256,
        "day": "2018-02-06"
      },
      {
        "value": 108,
        "day": "2016-06-27"
      },
      {
        "value": 318,
        "day": "2017-04-27"
      },
      {
        "value": 242,
        "day": "2016-09-15"
      },
      {
        "value": 203,
        "day": "2016-03-16"
      },
      {
        "value": 323,
        "day": "2016-01-28"
      },
      {
        "value": 373,
        "day": "2016-01-17"
      },
      {
        "value": 19,
        "day": "2018-08-02"
      },
      {
        "value": 176,
        "day": "2017-01-19"
      },
      {
        "value": 315,
        "day": "2015-11-20"
      },
      {
        "value": 338,
        "day": "2015-06-10"
      },
      {
        "value": 58,
        "day": "2017-09-30"
      },
      {
        "value": 170,
        "day": "2017-01-15"
      },
      {
        "value": 145,
        "day": "2016-05-30"
      },
      {
        "value": 200,
        "day": "2016-11-17"
      },
      {
        "value": 221,
        "day": "2018-06-21"
      },
      {
        "value": 193,
        "day": "2015-12-28"
      },
      {
        "value": 279,
        "day": "2017-05-11"
      },
      {
        "value": 261,
        "day": "2016-06-06"
      },
      {
        "value": 34,
        "day": "2015-10-09"
      },
      {
        "value": 287,
        "day": "2015-11-06"
      },
      {
        "value": 12,
        "day": "2016-08-06"
      },
      {
        "value": 307,
        "day": "2018-04-22"
      },
      {
        "value": 327,
        "day": "2017-04-01"
      },
      {
        "value": 337,
        "day": "2015-05-07"
      },
      {
        "value": 4,
        "day": "2017-11-04"
      },
      {
        "value": 139,
        "day": "2015-05-18"
      },
      {
        "value": 286,
        "day": "2018-03-27"
      },
      {
        "value": 220,
        "day": "2016-11-05"
      },
      {
        "value": 173,
        "day": "2016-03-28"
      },
      {
        "value": 354,
        "day": "2015-09-06"
      },
      {
        "value": 268,
        "day": "2018-06-07"
      },
      {
        "value": 23,
        "day": "2015-10-14"
      },
      {
        "value": 313,
        "day": "2016-10-28"
      },
      {
        "value": 398,
        "day": "2017-10-31"
      },
      {
        "value": 246,
        "day": "2016-12-04"
      },
      {
        "value": 25,
        "day": "2018-03-11"
      },
      {
        "value": 303,
        "day": "2017-07-17"
      },
      {
        "value": 81,
        "day": "2016-06-19"
      },
      {
        "value": 309,
        "day": "2015-06-28"
      },
      {
        "value": 327,
        "day": "2018-01-01"
      },
      {
        "value": 220,
        "day": "2015-12-20"
      },
      {
        "value": 345,
        "day": "2016-05-05"
      },
      {
        "value": 381,
        "day": "2016-09-26"
      },
      {
        "value": 309,
        "day": "2016-01-09"
      },
      {
        "value": 262,
        "day": "2016-01-15"
      },
      {
        "value": 248,
        "day": "2016-01-03"
      },
      {
        "value": 185,
        "day": "2016-10-06"
      },
      {
        "value": 174,
        "day": "2016-05-10"
      },
      {
        "value": 286,
        "day": "2015-12-19"
      },
      {
        "value": 147,
        "day": "2015-05-26"
      },
      {
        "value": 385,
        "day": "2015-06-12"
      },
      {
        "value": 364,
        "day": "2017-03-25"
      },
      {
        "value": 36,
        "day": "2017-10-19"
      },
      {
        "value": 166,
        "day": "2018-07-27"
      },
      {
        "value": 32,
        "day": "2016-09-06"
      },
      {
        "value": 45,
        "day": "2016-03-23"
      },
      {
        "value": 320,
        "day": "2017-02-03"
      },
      {
        "value": 98,
        "day": "2017-05-25"
      },
      {
        "value": 396,
        "day": "2016-09-29"
      },
      {
        "value": 263,
        "day": "2018-05-23"
      },
      {
        "value": 87,
        "day": "2015-04-24"
      },
      {
        "value": 305,
        "day": "2017-06-05"
      },
      {
        "value": 113,
        "day": "2017-12-19"
      },
      {
        "value": 78,
        "day": "2017-12-08"
      },
      {
        "value": 105,
        "day": "2018-06-02"
      },
      {
        "value": 381,
        "day": "2016-09-18"
      },
      {
        "value": 244,
        "day": "2017-06-02"
      },
      {
        "value": 75,
        "day": "2016-05-08"
      },
      {
        "value": 227,
        "day": "2017-04-26"
      },
      {
        "value": 152,
        "day": "2018-07-01"
      },
      {
        "value": 223,
        "day": "2017-08-17"
      },
      {
        "value": 13,
        "day": "2017-09-10"
      },
      {
        "value": 186,
        "day": "2016-08-24"
      },
      {
        "value": 175,
        "day": "2015-10-26"
      },
      {
        "value": 373,
        "day": "2018-03-01"
      },
      {
        "value": 385,
        "day": "2017-12-16"
      },
      {
        "value": 98,
        "day": "2015-07-17"
      },
      {
        "value": 351,
        "day": "2016-08-26"
      },
      {
        "value": 287,
        "day": "2016-07-20"
      },
      {
        "value": 233,
        "day": "2018-03-22"
      },
      {
        "value": 141,
        "day": "2017-11-07"
      },
      {
        "value": 164,
        "day": "2015-08-09"
      },
      {
        "value": 179,
        "day": "2018-06-05"
      },
      {
        "value": 62,
        "day": "2015-08-08"
      },
      {
        "value": 380,
        "day": "2018-02-21"
      },
      {
        "value": 287,
        "day": "2018-03-05"
      },
      {
        "value": 393,
        "day": "2015-10-08"
      },
      {
        "value": 24,
        "day": "2015-05-08"
      },
      {
        "value": 79,
        "day": "2017-09-05"
      },
      {
        "value": 10,
        "day": "2018-04-29"
      },
      {
        "value": 221,
        "day": "2015-11-12"
      },
      {
        "value": 375,
        "day": "2016-12-06"
      },
      {
        "value": 252,
        "day": "2015-05-27"
      },
      {
        "value": 114,
        "day": "2015-04-07"
      },
      {
        "value": 362,
        "day": "2015-08-07"
      },
      {
        "value": 375,
        "day": "2018-05-27"
      },
      {
        "value": 258,
        "day": "2018-07-11"
      },
      {
        "value": 87,
        "day": "2015-09-09"
      },
      {
        "value": 223,
        "day": "2017-12-22"
      },
      {
        "value": 292,
        "day": "2018-04-26"
      },
      {
        "value": 239,
        "day": "2017-03-07"
      },
      {
        "value": 44,
        "day": "2018-02-22"
      },
      {
        "value": 175,
        "day": "2015-10-22"
      },
      {
        "value": 127,
        "day": "2018-03-26"
      },
      {
        "value": 54,
        "day": "2016-07-23"
      },
      {
        "value": 376,
        "day": "2018-06-27"
      },
      {
        "value": 358,
        "day": "2018-01-03"
      },
      {
        "value": 139,
        "day": "2018-01-31"
      },
      {
        "value": 2,
        "day": "2015-12-03"
      },
      {
        "value": 171,
        "day": "2018-01-08"
      },
      {
        "value": 276,
        "day": "2018-05-12"
      },
      {
        "value": 101,
        "day": "2017-03-04"
      },
      {
        "value": 328,
        "day": "2018-04-15"
      },
      {
        "value": 86,
        "day": "2017-01-27"
      },
      {
        "value": 191,
        "day": "2017-11-17"
      },
      {
        "value": 106,
        "day": "2017-03-03"
      },
      {
        "value": 63,
        "day": "2015-08-30"
      },
      {
        "value": 218,
        "day": "2018-06-17"
      },
      {
        "value": 18,
        "day": "2018-04-28"
      },
      {
        "value": 378,
        "day": "2018-02-27"
      },
      {
        "value": 350,
        "day": "2018-05-30"
      },
      {
        "value": 97,
        "day": "2016-10-17"
      },
      {
        "value": 162,
        "day": "2016-01-27"
      },
      {
        "value": 155,
        "day": "2016-12-24"
      },
      {
        "value": 67,
        "day": "2016-11-16"
      },
      {
        "value": 329,
        "day": "2017-12-05"
      },
      {
        "value": 205,
        "day": "2016-02-13"
      },
      {
        "value": 83,
        "day": "2018-04-25"
      },
      {
        "value": 210,
        "day": "2015-04-18"
      },
      {
        "value": 313,
        "day": "2016-09-11"
      },
      {
        "value": 330,
        "day": "2017-09-19"
      },
      {
        "value": 229,
        "day": "2017-09-22"
      },
      {
        "value": 111,
        "day": "2017-12-17"
      },
      {
        "value": 234,
        "day": "2017-09-16"
      },
      {
        "value": 106,
        "day": "2017-11-03"
      },
      {
        "value": 18,
        "day": "2016-12-12"
      },
      {
        "value": 132,
        "day": "2018-03-21"
      },
      {
        "value": 281,
        "day": "2015-10-04"
      },
      {
        "value": 353,
        "day": "2015-12-11"
      },
      {
        "value": 313,
        "day": "2017-09-11"
      },
      {
        "value": 31,
        "day": "2018-07-31"
      },
      {
        "value": 104,
        "day": "2015-09-27"
      },
      {
        "value": 237,
        "day": "2018-01-07"
      },
      {
        "value": 63,
        "day": "2016-08-14"
      },
      {
        "value": 52,
        "day": "2017-12-30"
      },
      {
        "value": 311,
        "day": "2015-11-29"
      },
      {
        "value": 244,
        "day": "2017-11-02"
      },
      {
        "value": 296,
        "day": "2017-10-24"
      },
      {
        "value": 246,
        "day": "2015-05-14"
      },
      {
        "value": 2,
        "day": "2016-12-02"
      },
      {
        "value": 171,
        "day": "2015-08-17"
      },
      {
        "value": 98,
        "day": "2017-02-04"
      },
      {
        "value": 350,
        "day": "2015-07-05"
      },
      {
        "value": 42,
        "day": "2018-01-11"
      },
      {
        "value": 106,
        "day": "2018-05-19"
      },
      {
        "value": 343,
        "day": "2018-03-31"
      },
      {
        "value": 207,
        "day": "2015-11-26"
      },
      {
        "value": 240,
        "day": "2018-07-04"
      },
      {
        "value": 151,
        "day": "2015-08-25"
      },
      {
        "value": 184,
        "day": "2018-05-04"
      },
      {
        "value": 171,
        "day": "2017-01-21"
      },
      {
        "value": 250,
        "day": "2016-12-09"
      },
      {
        "value": 356,
        "day": "2015-10-03"
      },
      {
        "value": 396,
        "day": "2018-02-24"
      },
      {
        "value": 344,
        "day": "2015-08-02"
      },
      {
        "value": 253,
        "day": "2017-10-27"
      },
      {
        "value": 240,
        "day": "2017-12-04"
      },
      {
        "value": 350,
        "day": "2017-10-02"
      },
      {
        "value": 255,
        "day": "2018-05-11"
      },
      {
        "value": 95,
        "day": "2015-11-25"
      },
      {
        "value": 119,
        "day": "2016-05-09"
      },
      {
        "value": 80,
        "day": "2015-07-22"
      },
      {
        "value": 166,
        "day": "2018-06-09"
      },
      {
        "value": 38,
        "day": "2017-07-23"
      },
      {
        "value": 241,
        "day": "2015-12-24"
      },
      {
        "value": 232,
        "day": "2016-08-31"
      },
      {
        "value": 362,
        "day": "2015-10-15"
      },
      {
        "value": 109,
        "day": "2017-03-27"
      },
      {
        "value": 338,
        "day": "2017-04-03"
      },
      {
        "value": 2,
        "day": "2017-09-01"
      },
      {
        "value": 298,
        "day": "2018-05-25"
      },
      {
        "value": 215,
        "day": "2016-08-25"
      },
      {
        "value": 143,
        "day": "2017-02-27"
      },
      {
        "value": 173,
        "day": "2016-11-12"
      },
      {
        "value": 212,
        "day": "2018-07-05"
      },
      {
        "value": 231,
        "day": "2017-10-30"
      },
      {
        "value": 262,
        "day": "2016-11-13"
      },
      {
        "value": 315,
        "day": "2015-07-03"
      },
      {
        "value": 372,
        "day": "2017-05-03"
      },
      {
        "value": 340,
        "day": "2015-11-23"
      },
      {
        "value": 234,
        "day": "2018-02-18"
      },
      {
        "value": 341,
        "day": "2017-02-10"
      },
      {
        "value": 356,
        "day": "2017-03-02"
      },
      {
        "value": 311,
        "day": "2017-12-07"
      },
      {
        "value": 114,
        "day": "2017-05-15"
      },
      {
        "value": 187,
        "day": "2016-02-18"
      },
      {
        "value": 199,
        "day": "2018-03-29"
      },
      {
        "value": 204,
        "day": "2016-05-14"
      },
      {
        "value": 50,
        "day": "2016-06-23"
      },
      {
        "value": 173,
        "day": "2017-04-14"
      },
      {
        "value": 333,
        "day": "2015-04-11"
      },
      {
        "value": 138,
        "day": "2016-07-09"
      },
      {
        "value": 364,
        "day": "2017-05-28"
      },
      {
        "value": 270,
        "day": "2016-04-09"
      },
      {
        "value": 181,
        "day": "2015-04-28"
      },
      {
        "value": 4,
        "day": "2016-11-26"
      },
      {
        "value": 357,
        "day": "2017-12-21"
      },
      {
        "value": 300,
        "day": "2017-12-09"
      },
      {
        "value": 206,
        "day": "2017-12-29"
      },
      {
        "value": 192,
        "day": "2017-07-11"
      },
      {
        "value": 75,
        "day": "2017-06-15"
      },
      {
        "value": 15,
        "day": "2015-12-23"
      },
      {
        "value": 0,
        "day": "2015-06-07"
      },
      {
        "value": 143,
        "day": "2018-02-07"
      },
      {
        "value": 247,
        "day": "2015-11-18"
      },
      {
        "value": 221,
        "day": "2017-03-12"
      },
      {
        "value": 187,
        "day": "2016-12-28"
      },
      {
        "value": 348,
        "day": "2017-04-13"
      },
      {
        "value": 291,
        "day": "2017-09-04"
      },
      {
        "value": 164,
        "day": "2017-01-24"
      },
      {
        "value": 212,
        "day": "2017-08-18"
      },
      {
        "value": 108,
        "day": "2016-04-30"
      },
      {
        "value": 234,
        "day": "2017-06-08"
      },
      {
        "value": 150,
        "day": "2016-07-22"
      },
      {
        "value": 139,
        "day": "2017-08-13"
      },
      {
        "value": 345,
        "day": "2017-07-09"
      },
      {
        "value": 30,
        "day": "2016-11-03"
      },
      {
        "value": 310,
        "day": "2016-11-24"
      },
      {
        "value": 53,
        "day": "2016-01-23"
      },
      {
        "value": 263,
        "day": "2016-03-12"
      },
      {
        "value": 315,
        "day": "2018-04-20"
      },
      {
        "value": 384,
        "day": "2017-04-28"
      },
      {
        "value": 329,
        "day": "2016-09-25"
      },
      {
        "value": 321,
        "day": "2015-07-07"
      },
      {
        "value": 353,
        "day": "2017-09-27"
      },
      {
        "value": 295,
        "day": "2015-08-23"
      },
      {
        "value": 269,
        "day": "2016-10-09"
      },
      {
        "value": 290,
        "day": "2018-06-14"
      },
      {
        "value": 279,
        "day": "2017-10-29"
      },
      {
        "value": 273,
        "day": "2015-11-22"
      },
      {
        "value": 338,
        "day": "2017-05-12"
      },
      {
        "value": 72,
        "day": "2017-03-13"
      },
      {
        "value": 16,
        "day": "2017-01-28"
      },
      {
        "value": 255,
        "day": "2015-07-19"
      },
      {
        "value": 48,
        "day": "2018-04-14"
      },
      {
        "value": 261,
        "day": "2015-09-07"
      },
      {
        "value": 199,
        "day": "2015-11-19"
      },
      {
        "value": 355,
        "day": "2016-12-08"
      },
      {
        "value": 31,
        "day": "2017-05-20"
      },
      {
        "value": 225,
        "day": "2016-10-12"
      },
      {
        "value": 169,
        "day": "2016-10-20"
      },
      {
        "value": 326,
        "day": "2015-10-10"
      },
      {
        "value": 238,
        "day": "2017-01-17"
      },
      {
        "value": 15,
        "day": "2017-05-06"
      },
      {
        "value": 61,
        "day": "2017-12-02"
      },
      {
        "value": 41,
        "day": "2015-10-19"
      },
      {
        "value": 347,
        "day": "2018-02-12"
      },
      {
        "value": 299,
        "day": "2017-09-06"
      },
      {
        "value": 244,
        "day": "2016-04-14"
      },
      {
        "value": 349,
        "day": "2016-07-30"
      },
      {
        "value": 57,
        "day": "2015-09-19"
      },
      {
        "value": 247,
        "day": "2015-07-04"
      },
      {
        "value": 108,
        "day": "2017-01-07"
      },
      {
        "value": 26,
        "day": "2017-01-12"
      },
      {
        "value": 143,
        "day": "2015-06-20"
      },
      {
        "value": 335,
        "day": "2018-04-13"
      },
      {
        "value": 262,
        "day": "2015-06-05"
      },
      {
        "value": 45,
        "day": "2018-06-12"
      },
      {
        "value": 161,
        "day": "2018-06-20"
      },
      {
        "value": 210,
        "day": "2018-06-25"
      },
      {
        "value": 148,
        "day": "2017-09-23"
      },
      {
        "value": 121,
        "day": "2018-03-17"
      },
      {
        "value": 267,
        "day": "2015-11-13"
      },
      {
        "value": 121,
        "day": "2016-10-11"
      },
      {
        "value": 388,
        "day": "2015-05-06"
      },
      {
        "value": 242,
        "day": "2017-10-26"
      },
      {
        "value": 86,
        "day": "2017-02-06"
      },
      {
        "value": 364,
        "day": "2017-09-15"
      },
      {
        "value": 347,
        "day": "2016-12-14"
      },
      {
        "value": 152,
        "day": "2015-09-11"
      },
      {
        "value": 13,
        "day": "2015-06-03"
      },
      {
        "value": 195,
        "day": "2015-07-06"
      },
      {
        "value": 205,
        "day": "2018-07-25"
      },
      {
        "value": 53,
        "day": "2016-11-29"
      },
      {
        "value": 118,
        "day": "2015-04-21"
      },
      {
        "value": 340,
        "day": "2017-04-18"
      },
      {
        "value": 98,
        "day": "2015-09-24"
      },
      {
        "value": 275,
        "day": "2017-07-12"
      },
      {
        "value": 344,
        "day": "2016-09-13"
      },
      {
        "value": 257,
        "day": "2016-06-28"
      },
      {
        "value": 196,
        "day": "2016-07-18"
      },
      {
        "value": 183,
        "day": "2016-01-21"
      },
      {
        "value": 280,
        "day": "2016-05-13"
      },
      {
        "value": 383,
        "day": "2016-05-02"
      },
      {
        "value": 212,
        "day": "2015-04-22"
      },
      {
        "value": 377,
        "day": "2015-04-29"
      },
      {
        "value": 354,
        "day": "2016-11-08"
      },
      {
        "value": 267,
        "day": "2015-11-16"
      },
      {
        "value": 118,
        "day": "2016-07-25"
      },
      {
        "value": 91,
        "day": "2017-09-29"
      },
      {
        "value": 233,
        "day": "2015-04-19"
      },
      {
        "value": 346,
        "day": "2015-10-21"
      },
      {
        "value": 248,
        "day": "2015-11-03"
      },
      {
        "value": 287,
        "day": "2018-01-19"
      },
      {
        "value": 156,
        "day": "2016-08-16"
      },
      {
        "value": 115,
        "day": "2016-08-04"
      },
      {
        "value": 27,
        "day": "2015-05-04"
      },
      {
        "value": 395,
        "day": "2017-05-26"
      },
      {
        "value": 257,
        "day": "2017-06-17"
      },
      {
        "value": 235,
        "day": "2016-09-03"
      },
      {
        "value": 153,
        "day": "2017-01-26"
      },
      {
        "value": 103,
        "day": "2015-09-16"
      },
      {
        "value": 303,
        "day": "2016-06-18"
      },
      {
        "value": 163,
        "day": "2018-03-19"
      },
      {
        "value": 222,
        "day": "2016-04-26"
      },
      {
        "value": 88,
        "day": "2015-09-26"
      },
      {
        "value": 201,
        "day": "2018-08-01"
      },
      {
        "value": 333,
        "day": "2018-08-11"
      },
      {
        "value": 319,
        "day": "2016-10-14"
      },
      {
        "value": 183,
        "day": "2017-01-03"
      },
      {
        "value": 362,
        "day": "2015-04-09"
      },
      {
        "value": 297,
        "day": "2018-03-06"
      },
      {
        "value": 16,
        "day": "2017-06-24"
      },
      {
        "value": 195,
        "day": "2017-02-07"
      },
      {
        "value": 150,
        "day": "2015-12-15"
      },
      {
        "value": 256,
        "day": "2017-10-11"
      },
      {
        "value": 343,
        "day": "2016-02-09"
      },
      {
        "value": 210,
        "day": "2017-05-22"
      },
      {
        "value": 381,
        "day": "2015-09-17"
      },
      {
        "value": 171,
        "day": "2017-08-22"
      },
      {
        "value": 272,
        "day": "2017-06-13"
      },
      {
        "value": 263,
        "day": "2016-04-02"
      },
      {
        "value": 332,
        "day": "2016-07-04"
      },
      {
        "value": 142,
        "day": "2017-08-14"
      },
      {
        "value": 160,
        "day": "2018-07-19"
      },
      {
        "value": 73,
        "day": "2015-06-24"
      },
      {
        "value": 171,
        "day": "2018-04-27"
      },
      {
        "value": 373,
        "day": "2017-02-20"
      },
      {
        "value": 274,
        "day": "2016-09-12"
      },
      {
        "value": 128,
        "day": "2017-08-19"
      },
      {
        "value": 35,
        "day": "2017-12-10"
      },
      {
        "value": 161,
        "day": "2018-04-07"
      },
      {
        "value": 223,
        "day": "2016-12-15"
      },
      {
        "value": 287,
        "day": "2015-06-19"
      },
      {
        "value": 382,
        "day": "2015-10-20"
      },
      {
        "value": 170,
        "day": "2017-08-29"
      },
      {
        "value": 280,
        "day": "2016-07-08"
      },
      {
        "value": 333,
        "day": "2015-07-02"
      },
      {
        "value": 297,
        "day": "2018-07-07"
      },
      {
        "value": 149,
        "day": "2017-12-27"
      },
      {
        "value": 73,
        "day": "2016-10-03"
      },
      {
        "value": 87,
        "day": "2017-02-12"
      },
      {
        "value": 240,
        "day": "2017-06-28"
      },
      {
        "value": 213,
        "day": "2018-01-25"
      },
      {
        "value": 117,
        "day": "2016-11-23"
      },
      {
        "value": 115,
        "day": "2018-01-20"
      },
      {
        "value": 275,
        "day": "2016-11-11"
      },
      {
        "value": 341,
        "day": "2018-01-24"
      },
      {
        "value": 155,
        "day": "2017-01-30"
      },
      {
        "value": 166,
        "day": "2016-08-22"
      },
      {
        "value": 215,
        "day": "2016-03-13"
      },
      {
        "value": 144,
        "day": "2016-12-19"
      },
      {
        "value": 272,
        "day": "2018-03-25"
      },
      {
        "value": 229,
        "day": "2016-03-10"
      },
      {
        "value": 350,
        "day": "2016-01-13"
      },
      {
        "value": 253,
        "day": "2016-04-06"
      },
      {
        "value": 324,
        "day": "2018-06-30"
      },
      {
        "value": 196,
        "day": "2018-05-16"
      },
      {
        "value": 362,
        "day": "2016-08-03"
      },
      {
        "value": 48,
        "day": "2017-12-31"
      },
      {
        "value": 379,
        "day": "2017-02-11"
      },
      {
        "value": 232,
        "day": "2018-06-04"
      },
      {
        "value": 293,
        "day": "2015-08-21"
      },
      {
        "value": 155,
        "day": "2016-08-09"
      },
      {
        "value": 390,
        "day": "2016-05-19"
      },
      {
        "value": 215,
        "day": "2016-02-05"
      },
      {
        "value": 15,
        "day": "2016-07-17"
      },
      {
        "value": 131,
        "day": "2016-12-26"
      },
      {
        "value": 240,
        "day": "2015-08-15"
      },
      {
        "value": 310,
        "day": "2017-04-05"
      },
      {
        "value": 357,
        "day": "2016-03-24"
      },
      {
        "value": 169,
        "day": "2018-05-09"
      },
      {
        "value": 47,
        "day": "2017-10-22"
      },
      {
        "value": 50,
        "day": "2015-12-22"
      },
      {
        "value": 78,
        "day": "2016-11-15"
      },
      {
        "value": 259,
        "day": "2016-03-21"
      },
      {
        "value": 21,
        "day": "2015-06-04"
      },
      {
        "value": 166,
        "day": "2016-02-15"
      },
      {
        "value": 104,
        "day": "2016-11-14"
      },
      {
        "value": 271,
        "day": "2016-04-05"
      },
      {
        "value": 267,
        "day": "2016-09-01"
      },
      {
        "value": 135,
        "day": "2015-09-08"
      },
      {
        "value": 269,
        "day": "2017-04-29"
      },
      {
        "value": 391,
        "day": "2017-11-10"
      },
      {
        "value": 310,
        "day": "2018-03-30"
      },
      {
        "value": 13,
        "day": "2017-05-19"
      },
      {
        "value": 39,
        "day": "2015-10-18"
      },
      {
        "value": 90,
        "day": "2016-03-11"
      },
      {
        "value": 64,
        "day": "2018-03-02"
      },
      {
        "value": 318,
        "day": "2016-09-08"
      },
      {
        "value": 132,
        "day": "2016-04-15"
      },
      {
        "value": 345,
        "day": "2017-12-15"
      },
      {
        "value": 250,
        "day": "2015-11-04"
      },
      {
        "value": 315,
        "day": "2017-03-20"
      },
      {
        "value": 107,
        "day": "2016-01-14"
      },
      {
        "value": 201,
        "day": "2015-09-29"
      },
      {
        "value": 250,
        "day": "2015-12-18"
      },
      {
        "value": 212,
        "day": "2017-06-14"
      },
      {
        "value": 385,
        "day": "2016-07-27"
      },
      {
        "value": 231,
        "day": "2018-07-22"
      },
      {
        "value": 147,
        "day": "2017-03-08"
      },
      {
        "value": 354,
        "day": "2015-06-01"
      },
      {
        "value": 26,
        "day": "2016-01-02"
      },
      {
        "value": 138,
        "day": "2017-07-19"
      },
      {
        "value": 257,
        "day": "2015-09-22"
      },
      {
        "value": 340,
        "day": "2017-01-29"
      },
      {
        "value": 92,
        "day": "2018-05-08"
      },
      {
        "value": 84,
        "day": "2015-05-05"
      },
      {
        "value": 301,
        "day": "2017-07-18"
      },
      {
        "value": 234,
        "day": "2016-11-02"
      },
      {
        "value": 138,
        "day": "2016-07-11"
      },
      {
        "value": 38,
        "day": "2015-12-30"
      },
      {
        "value": 373,
        "day": "2017-07-20"
      },
      {
        "value": 162,
        "day": "2018-02-13"
      },
      {
        "value": 297,
        "day": "2017-11-14"
      },
      {
        "value": 291,
        "day": "2016-11-01"
      },
      {
        "value": 26,
        "day": "2017-11-11"
      },
      {
        "value": 51,
        "day": "2016-05-20"
      },
      {
        "value": 379,
        "day": "2016-09-04"
      },
      {
        "value": 161,
        "day": "2017-03-19"
      },
      {
        "value": 342,
        "day": "2015-10-30"
      },
      {
        "value": 158,
        "day": "2017-08-24"
      },
      {
        "value": 339,
        "day": "2016-06-30"
      },
      {
        "value": 87,
        "day": "2017-06-30"
      },
      {
        "value": 284,
        "day": "2018-06-08"
      },
      {
        "value": 89,
        "day": "2016-01-25"
      },
      {
        "value": 152,
        "day": "2015-11-15"
      },
      {
        "value": 327,
        "day": "2018-06-01"
      },
      {
        "value": 295,
        "day": "2016-03-03"
      },
      {
        "value": 124,
        "day": "2018-05-24"
      },
      {
        "value": 300,
        "day": "2018-02-17"
      },
      {
        "value": 91,
        "day": "2017-05-21"
      },
      {
        "value": 286,
        "day": "2017-02-25"
      },
      {
        "value": 16,
        "day": "2018-05-02"
      },
      {
        "value": 66,
        "day": "2015-04-16"
      },
      {
        "value": 281,
        "day": "2018-01-22"
      },
      {
        "value": 36,
        "day": "2018-04-04"
      },
      {
        "value": 305,
        "day": "2016-12-16"
      },
      {
        "value": 38,
        "day": "2017-02-05"
      },
      {
        "value": 86,
        "day": "2017-11-26"
      },
      {
        "value": 184,
        "day": "2015-05-28"
      },
      {
        "value": 189,
        "day": "2017-10-13"
      },
      {
        "value": 62,
        "day": "2018-05-22"
      },
      {
        "value": 301,
        "day": "2016-03-01"
      },
      {
        "value": 354,
        "day": "2016-04-29"
      },
      {
        "value": 136,
        "day": "2016-12-20"
      },
      {
        "value": 189,
        "day": "2016-06-10"
      },
      {
        "value": 348,
        "day": "2016-12-25"
      },
      {
        "value": 86,
        "day": "2015-10-28"
      },
      {
        "value": 319,
        "day": "2017-09-17"
      },
      {
        "value": 23,
        "day": "2016-10-31"
      },
      {
        "value": 212,
        "day": "2017-04-20"
      },
      {
        "value": 246,
        "day": "2017-11-20"
      },
      {
        "value": 40,
        "day": "2018-04-02"
      },
      {
        "value": 230,
        "day": "2016-04-21"
      },
      {
        "value": 356,
        "day": "2016-11-28"
      },
      {
        "value": 85,
        "day": "2015-11-09"
      },
      {
        "value": 377,
        "day": "2015-09-21"
      },
      {
        "value": 156,
        "day": "2015-08-16"
      },
      {
        "value": 8,
        "day": "2017-11-12"
      },
      {
        "value": 391,
        "day": "2017-01-02"
      },
      {
        "value": 78,
        "day": "2017-02-14"
      },
      {
        "value": 17,
        "day": "2015-07-08"
      },
      {
        "value": 336,
        "day": "2015-09-13"
      },
      {
        "value": 180,
        "day": "2016-05-12"
      },
      {
        "value": 144,
        "day": "2016-06-22"
      },
      {
        "value": 45,
        "day": "2016-07-10"
      },
      {
        "value": 382,
        "day": "2016-02-01"
      },
      {
        "value": 96,
        "day": "2017-07-24"
      },
      {
        "value": 398,
        "day": "2018-05-18"
      },
      {
        "value": 151,
        "day": "2017-06-04"
      },
      {
        "value": 39,
        "day": "2016-01-18"
      },
      {
        "value": 306,
        "day": "2016-05-27"
      },
      {
        "value": 152,
        "day": "2017-09-02"
      },
      {
        "value": 396,
        "day": "2015-05-10"
      },
      {
        "value": 14,
        "day": "2017-08-06"
      },
      {
        "value": 272,
        "day": "2016-04-16"
      },
      {
        "value": 111,
        "day": "2017-08-20"
      },
      {
        "value": 49,
        "day": "2015-08-13"
      },
      {
        "value": 149,
        "day": "2018-01-04"
      },
      {
        "value": 396,
        "day": "2018-03-18"
      },
      {
        "value": 286,
        "day": "2015-07-21"
      }
    ]

    return (
        <>
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <dl style={{ width: '80%' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Media</th>
              <th>#</th>
              <th>Amount of Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Books</td>
              <td>{BookStat}</td>
              <td>You have spent around {BookStat * 600} minutes! Which is around {Math.round((BookStat * 600)/60)} hours! Which is about {((BookStat * 600)/1440).toFixed(2)} days!</td>
            </tr>
            <tr>
              <td>Movies</td>
              <td>{MovieStat}</td>
              <td>You have spent around {MovieStat * 110} minutes! Which is around {((MovieStat * 110)/60).toFixed(2)} hours! Which is about {((MovieStat * 110)/1440).toFixed(2)} days!</td>
            </tr>
            <tr>
              <td>TV Shows</td>
              <td>{TVStat}</td>
              <td>You have spent around {TVStat * 16 * 40} minutes! Which is around {((TVStat * 16 * 40)/60).toFixed(2)} hours! Which is about {((TVStat * 16 * 40)/1440).toFixed(2)} days!</td>
            </tr>
          </tbody>
        </Table>
        </dl>
        <ProSidebarProvider style={{  rtl: 'true', flexDirection: "row-reverse", height: '100%' }} rtl={true}>
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
              </MenuItem>
        <GoalPopUp />
            </Menu>
          </Sidebar>
                
        </ProSidebarProvider>
      </div>
        <div style={{ height: 400, width: '70%', display: 'inline-flex' }}>
        {MyResponsiveBar()}
      </div>
      <div style={{ height: 400, width: '30%', display: 'inline-flex' }}>
        {Pie()}
      </div>
      <div style={{ height: 400, width: '100%', display: 'inline-flex' }}>
        {Calendar()}
      </div>
      </>

    )
}


export default MyStats;