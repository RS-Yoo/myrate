import React from "react";
import Navbar from "../Components/Navbar";
import TrendingMovies from "../Components/TrendingMovies";
import TrendingTV from "../Components/TrendingTV";
import BookSelector from "../Components/BookSelector";
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
        </>
    );
};

export default Landing;
