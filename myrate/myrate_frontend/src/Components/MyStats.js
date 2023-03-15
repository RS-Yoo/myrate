import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

// Chart imports
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import GoalSideBar from './GoalSidebar';

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
        response.data.map(d => {
          if (d["media_type"] === "books") {
            bs++;
          } else if (d["media_type"] === "movies") {
            ms++;
          } else {
            tvs++;
          }
        });

        setBookStat(bs);
        setMovieStat(ms);
        setTVStat(tvs);
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

  function returnGoals(goals) {
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
            nowNum = BookStat / g.amount;
            ttstr = "Read " + BookStat + " books out of " + g.amount;
          }
          else if (g.mediaType === "Movies")
          {
            nowNum = MovieStat / g.amount;
            ttstr = "Watched " + BookStat + " movies out of " + g.amount;
          }
          else
          {
            nowNum = TVStat / g.amount;
            ttstr = "Watched " + BookStat + " shows out of " + g.amount;
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
                {returnGoals(yearly)}
              </SubMenu>
              <SubMenu label="Monthly Goals">

                {returnGoals(monthly)}
              </SubMenu>
              <SubMenu label="Daily Goals">
                {returnGoals(daily)}
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