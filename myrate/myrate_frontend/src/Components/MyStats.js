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
import { element } from "prop-types";

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
    let [calFinalData, setCalFinalData] = useState([]);
  
    let yearlyGoals = [];
    let monthlyGoals = [];
    let dailyGoals = [];

    let calendarDate = [];
    let calendarCount = [];
    const cData = [];

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
              // console.log("year for book: " + ratingDate.getFullYear());
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

    useEffect(() => {
      axios.get(`http://localhost:5000/completed/findstatcompleted/`, {
        params: {
          username: userProfile.username
        },
      })
      .then(function (response) {
        let count = 1;
        let year = 0;
        let month = 0;
        let day = 0;
        //console.log("test: " + JSON.stringify(response));

        response.data.map(d => {
          let setDate = new Date(d["date"]);

          year = setDate.getFullYear();
          month = setDate.getMonth();
          if(month.toString().length === 1) {
            month = "0" + month;
          }
          day = setDate.getDay();
          if(day.toString().length === 1) {
            day = "0" + day;
          }
          // console.log("date => year: " + year + " month: " + month + " day: " + day);
          calendarDate.push("" + year + "-" + month + "-" + day);
        })

        let temp = new Set(calendarDate);
        let fuckthisbullshit = [];
        for(const element of temp) {
          fuckthisbullshit.push(element);
        }

        let length = calendarDate.length;
        for(let i = 0; i < fuckthisbullshit.length - 1; i++) {
          count = 0;
          for(let j = 0; j < length; j++) {
            if(fuckthisbullshit[i] === calendarDate[j]) {
              count++;
            }
          }
          calendarCount.push(count);
        }

        console.log(JSON.stringify(calendarCount));
        console.log(JSON.stringify(fuckthisbullshit));

        for(let i = 0; i < fuckthisbullshit.length; i++) {
          cData.push({
            value: calendarCount[i],
            day: fuckthisbullshit[i],
          });
        }
        
        cData.map(d => {
          calFinalData.push(d);
        });

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
        data={calFinalData}
        from="2020-04-01"
        to="2023-12-31"
        emptyColor="#eeeeee"
        colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
        minValue={0}
        maxValue={10}
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
    // console.log("In edit rating");  
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
    // console.log(JSON.stringify(goals));
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
    // console.log(JSON.stringify(goals));
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
    // console.log(JSON.stringify(goals));
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
      <div style={{ height: 1200, width: '100%', display: 'inline-flex' }}>
        {Calendar()}
      </div>
      </>

    )
}


export default MyStats;