import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';

const MyStats = () => {
    let [BookStat, setBookStat] = useState(0);
    let [MovieStat, setMovieStat] = useState(0);
    let [TVStat, setTVStat] = useState(0);
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
                    if(d["media_type"] === "books") {
                        bs++;
                    } else if(d["media_type"] === "movies") {
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

    return (
        <><dl>
            <dt><strong>Books</strong></dt>
                <dd><li><i>Amount of Books Read: {BookStat}</i></li></dd>
                <dd><li><i>Time Spent Reading: {BookStat * 600} mins!</i></li></dd>
            <dt><strong>Movies</strong></dt>
                <dd><li><i>Amount of Movies Watched: {MovieStat}</i></li></dd>
                <dd><li><i>Time Spent Watching Movies: {MovieStat * 110} mins!</i></li></dd>
            <dt><strong>TV Shows</strong></dt>
                <dd><li><i>Amount of TV Shows Watched: {TVStat}</i></li></dd>
                <dd><li><i>Time Spent Watching TV Shows: {TVStat * 16 * 40} mins!</i></li></dd>
        </dl></>
    )
}


const data = [
    {
      day: "Monday",
      degress: 59
    },
    {
      day: "Tuesday",
      degress: 61
    },
    {
      day: "Wednesday",
      degress: 55
    },
    {
      day: "Thursday",
      degress: 78
    },
    {
      day: "Friday",
      degress: 71
    },
    {
      day: "Saturday",
      degress: 56
    },
    {
      day: "Sunday",
      degress: 67
    }
  ];

  const Bar = () => {
    return (
      <ResponsiveBar
        data={data}
        keys={["degress"]}
        indexBy="day"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        colors="#3182CE"
        animate={true}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "degrees",
          legendPosition: "middle",
          legendOffset: -40
        }}
      />
    );
  };

export default MyStats;