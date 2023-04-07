import { React } from "react";
import { Link } from "react-router-dom";
import "./RelatedTitlesSliderList.css";
import useAxiosTMDB from "../Hooks/useAxiosTMDB";

const RelatedTitlesSliderList = (props) => {
    
    const path = props.apiId;
    // Base URL that needs to be pre-pended to 'poster_path'
    const prePosterPath = "https://image.tmdb.org/t/p/original";
    console.log("slider", props.apiId);

    // Disclaimer that needs to be included when using TMDB API data
    const disclaimer = "This product uses the TMDB API but is not endorsed or certified by TMDB.";


    const { response, loading, error } = useAxiosTMDB({
        method: 'get',
        url: `movie/${path}/similar`,
        sortByPopularity: true,
    }, [props.apiId]);

    const renderMovieSliderList = (trendingObj) => {
        if (!loading) {
            return (
                <div className="horizontalScroll">
                    {trendingObj.map(movie => (
                        <div className="bookDiv">
                            <div className="moviePosterDiv">
                                <Link to={`/secondary-movie-page/${movie['id']}`} state={{ movieDetails: { movie } }}>
                                    {<img src={`${prePosterPath}${movie['poster_path']}`} height="200" width="125" />}
                                </Link>
                            </div>
                        </div>
                    ))}
                    <p className="disclaimerTMDB">{disclaimer}</p>
                </div>
            );
        }
    };

    const renderTvSliderList = (trendingObj) => {
        if (!loading) {
            return (
                <div className="horizontalScroll">
                    {trendingObj.map(tv => (
                        <div className="bookDiv">
                            <div className="tvPosterDiv">
                                <Link to={`/secondary-tv-page/${tv['id']}`} state={{ tvDetails: { tv } }}>
                                    {<img src={`${prePosterPath}${tv['poster_path']}`} height="200" width="125" />}
                                </Link>
                            </div>
                        </div>
                    ))}
                    <p className="disclaimerTMDB">{ disclaimer }</p>
                </div>
            );
        }
    };

    const renderSlider = (trendingObj, isMovie) => {
        if (isMovie) {
            return renderMovieSliderList(trendingObj);
        }
        else {
            return renderTvSliderList(trendingObj);
        }
    };

    if (!props.apiId || !response) {
        return (
            <>
            <div className="relatedTitlesSliderListDiv">
                <h5>Related Titles</h5>
            </div>
            </>
        );
    }
    else {

    return (
        <>
            <div className="relatedTitlesSliderListDiv">
                <h5>Related Titles</h5>
                {renderSlider(response, props.isMovie)}
            </div>
        </>
    );
    }
};

export default RelatedTitlesSliderList;
