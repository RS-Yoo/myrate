import React, { useEffect } from 'react';
import Landing from "./Screens/Landing";
import Discover from "./Screens/Discover";
import Collections from "./Screens/Collections";
import MyStats from "./Screens/MyStats";
import SecondaryBook from "./Screens/SecondaryBook";
import SecondaryMovie from "./Screens/SecondaryMovie";
import SecondaryTV from "./Screens/SecondaryTV";
import Profile from "./Screens/Profile";
import LoginScreen from "./Screens/LoginScreen";
import SearchPage from "./Screens/SearchPage";
import SignupScreen from "./Screens/SignupScreen";
import MyHealth from "./Screens/MyHealth";

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import useAxiosNYT from './Hooks/useAxiosNYT';
import TrendingBooks from './Components/TrendingBooks';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateTrendingBooks } from './store';

const App = () => {
    let st = useSelector((state) => { return state.trendingBooks; })
    var dispatch = useDispatch();

    const renderTrendingBooks = (response) => {

        let allTrending = [];
        for (let listIdx in response.results.lists) {
            const listObj = response.results.lists[listIdx];

            let bookList = []
            for (let bookIdx in listObj.books) {
                const image = listObj.books[bookIdx]['book_image'];
                const bookTitle = listObj.books[bookIdx]['title'];
                const bookAuthor = listObj.books[bookIdx]['author'];
                const publisher = listObj.books[bookIdx]['publisher'];
                const isbn_10 = listObj.books[bookIdx]['primary_isbn10'];
                const isbn_13 = listObj.books[bookIdx]['primary_isbn13'];
                const description = listObj.books[bookIdx]['description'];

                let purchaseLinks = [];
                for (let purchaseIdx in listObj.books[bookIdx]['buy_links']) {
                    const url = listObj.books[bookIdx]['buy_links'][purchaseIdx].url;
                    const name = listObj.books[bookIdx]['buy_links'][purchaseIdx].name;

                    if (name === "Amazon" || name === "Apple Books" || name === "Barnes and Noble")
                        purchaseLinks.push({ name, url });
                }
                bookList.push({ image, bookTitle, bookAuthor, publisher, isbn_10, isbn_13, description, purchaseLinks });
            }
            const displayName = listObj['display_name'];
            allTrending.push({ displayName, bookList });
        }

        return allTrending;
    };

    useEffect(() => {
            const NYT_API_KEY = 'api-key=cLdOpoHOGl43aVB1xShNdt3oLHbGxixL';
            let url = 'full-overview.json';
            let method = 'get';
            let response = null
            let error = '';
            let loading = true;
            axios[method]('https://api.nytimes.com/svc/books/v3/lists/' + `${url}?${NYT_API_KEY}`, JSON.parse(null), JSON.parse(null))
                .then((res) => {
                    response = res.data;
                    let result = renderTrendingBooks(response);
                    // update redux store
                    dispatch(updateTrendingBooks(result));
                })
                .catch((err) => {
                    error = err;
                })
                .finally(() => {
                    loading = false;
                });

    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Landing /> } />
                <Route path="/profile" element={<Profile />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/mystats" element={<MyStats />} />
                <Route path="/secondary-book-page" element={<SecondaryBook />} />
                <Route path="/secondary-movie-page/:id" element={<SecondaryMovie />} />
                <Route path="/secondary-tv-page/:id" element={<SecondaryTV />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/search-page" element={<SearchPage />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/myHealth" element={<MyHealth />} />
            </Routes>
        </Router>
    );
};

export default App;
