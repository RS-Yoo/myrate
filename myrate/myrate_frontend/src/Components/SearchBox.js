import React, { useState, useEffect } from "react";
import useAxiosGoogleBooks from "../Hooks/useAxiosGoogleBooks";
import useAxiosLibraryBooks from "../Hooks/useAxiosLibraryBooks";
import useAxiosTMDBSearch from "../Hooks/useAxiosTMDBSearch";
import "./TrendingMovies.css";
import Dropdown from 'react-bootstrap/Dropdown';
import "./SearchBox.css";
import { useNavigate } from 'react-router-dom';


const SearchBox = (timeFrame, count) => {

    const [searchEntry, setSearchEntry] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [showDrop, setShowDrop] = useState(false);
    var pub;
    var isbn_10_input;
    var isbn_13_input;
    var amazon;
    const navigate = useNavigate();

    const changed = (e) => {
        console.log(e.target.value);
        e.preventDefault();
        setSearchEntry(e.target.value);
        if(searchEntry.length <= 1)
            setShowDrop(false);
        else
            setShowDrop(true);
    };

    const { responsem, loadingm, errorm } = useAxiosTMDBSearch({
        method: 'get',
        url: `search/movie`,
        query: searchEntry,
        sortByPopularity: true,
        responseLength: 5,
    });


    const { response, loading, error } = useAxiosGoogleBooks({
        method: 'get',
        searchterms: searchEntry,
        specify_type : 'q',
        responseLength: 5,
    });

    const { responseb, loadingb, errorb } = useAxiosLibraryBooks({
        method: 'get',
        key: searchKey,
    });


    async function findBook (inputKey, author, pub) {
        setSearchKey(inputKey);
        console.log("beresponse: " + responseb);
        secondfindbook(author, pub);     

    }

    function findMovie(movie)
    {
        navigate(`/secondary-movie-page/${movie['id']}`, {state:{ movieDetails: { movie } }});
    }
    
    function secondfindbook(author) {
        if(!loadingb)
        {
            var image = "https://covers.openlibrary.org/b/ID/" + responseb.covers[0] + "-M.jpg";
            var bookTitle = responseb.title;
            var bookAuthor = author;
            var publisher = response.publisher;
            var description = responseb.description.value;
            var amazonlink = "amazon.com/db/" + amazon;

            const bookDetails = {book : {image: image, bookTitle: bookTitle, bookAuthor: bookAuthor, publisher: pub, isbn_10: isbn_10_input, isbn_13: isbn_13_input, description: description, purchaseLinks: [{name: "Amazon" }, {link: amazonlink}]}}
            
            console.log("details: " + JSON.stringify(bookDetails));
            
            navigate('/secondary-book-page', { state : {bookDetails}} );
        }
    }


    const renderSliderList = (res, resm) => {
        if (!loading && !loadingm) {
            var result = [];
            var text = "";
            try {
                res = res.docs;

            }
            catch {}
            //resm = resm.results;
            if(resm !== undefined)
            {
                let length = resm.length;
                if(length > 5)
                    length = 5;
                console.log(resm.length);
               // for (let i = 0; i < length; i++)
                {
                  //  console.log(i);
                    result.push (
                        <div>
                            {
                                (resm.map(movie => (
                                    <Dropdown.Item onClick={() => findMovie(movie)}>
                                        <p >{movie.original_title} (Movie)</p>
                                        <Dropdown.Divider />
                                    </Dropdown.Item>

                                )))
                            }
                        </div>
                    )

                    

                }
                
            }
            if(res !== undefined)
            {
                let length = res.length;
                if(length > 5)
                    length = 5;
                for (let i = 0; i < length; i++) {
                    // will need to change probably but good for now
                    try {
                        pub = res[i].publisher[0];
                        isbn_10_input = res[i].isbn[0];
                        isbn_13_input = res[i].isbn[1];
                        amazon = res[i].id_amazon[0];
                    }
                    catch 
                    {

                    }
                }
                result.push (
                    <div>
                        {
                            (res.map(book => (
                                <Dropdown.Item onClick={() => findBook(book.key, book.author_name)}>
                                    <p >{book.title} by {book.author_name} (Book)</p>
                                    <Dropdown.Divider />
                                </Dropdown.Item>
                                
                            )))
                        }
                    </div>
                )
                return result;
            }

        }
    }

    return (
        <>
            <div class="container d-flex justify-content-center">
                <div class="row ">
                    <div class="col-md-8">
                        <div class="form-outline">
                            <input type="text" placeholder="Search Media" value={searchEntry} onChange={changed} id="searchBox" class="form-control" />
                        </div>
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-primary" onClick={() => navigate('/search-page', { state : {searchEntry} } )}>Search</button>
                    </div>
                    <div>
                        <Dropdown.Menu show = {showDrop? true : false}>
                            {renderSliderList(response, responsem)}
                            <Dropdown.Item onClick={() => navigate('/search-page', { state : {searchEntry} } )} className="dropdownlink" >
                                View More Results
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </div>
                </div>
            </div>

        </>
    );
};

export default SearchBox;

