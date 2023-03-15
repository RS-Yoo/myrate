import axios from 'axios';
import { useState, useEffect } from 'react';

/***
 * IMPORTANT NOTE:
 * 
 * The full response is a multi-page response.
 * https://developers.google.com/books/docs/v1/reference/?apix=true
 * */

// Required as final query parameter to authorize GET request
const GOOGLE_API_KEY = 'key=AIzaSyDpaGYiWMq7RD5pajfAXDt30AZ9Aq5flgc';

axios.defaults.baseURL = 'https://openlibrary.org/search.json?q=';// 'https://www.googleapis.com/books/v1/volumes?q='//search+terms'

const useAxiosLibraryBooks = ({ key, method, body = null, headers = null, }) => {
    const [responseb, setResponseb] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = async () => {
        axios[method]('https://openlibrary.org'+`${key}`+'.json', JSON.parse(headers), JSON.parse(body))//'https://www.googleapis.com/books/v1/volumes?q='+`${searchterms}:keyes&${GOOGLE_API_KEY}`, JSON.parse(headers), JSON.parse(body))
        .then((res) => {
            //console.log('https://openlibrary.org'+`${key}`+'.json');
            //console.log("--------------------------");
            //console.log(JSON.stringify(res.data));
            setResponseb(res.data);
        })
        .catch((err) => {
            console.log("Library errored: " + err);
            setError(err);
        })
        .finally(() => {
            //console.log("IN finally");
            setloading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [method, key, body, headers]);

    return { responseb, error, loading };
};

export default useAxiosLibraryBooks;