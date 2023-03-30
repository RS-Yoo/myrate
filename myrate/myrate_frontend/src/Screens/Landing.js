import React from "react";
import Navbar from "../Components/Navbar";
import TrendingMovies from "../Components/TrendingMovies";
import TrendingTV from "../Components/TrendingTV";
import BookSelector from "../Components/BookSelector";
import { Link } from "react-router-dom";
import './Landing.css'

const Landing = () => {

    return (
        <>
        <Navbar />
        <section>
            <div>
                <div>
                    <div>
                        <div>
                            <h1 className="header">
                                One Platform, All Media
                            </h1>
                            {/* <div>
                                    <button>
                                        Get started
                                    </button>
                                    <Link to="/Discover">
                                        <button>  
                                        Discover
                                        </button>
                                    </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            </section>
            < BookSelector />
            < TrendingMovies timeFrame={"day"} movieCount={20} />
            < TrendingTV timeFrame={"day"} tvCount={20} />
            <p id="myHealthLink">Looking to improve your health and fitness? Head over to <Link to="/myHealth">MyHealth</Link> to learn more.</p>
        </>
    );
};

export default Landing;
