import axios from 'axios';
import { useState, useEffect } from 'react';

/***
 * IMPORTANT NOTE:
 * 
 * The full response is a multi-page response.
 * This hook returns only the 20 items from the first page of results.
 * 
 * */

// Required as final query parameter to authorize GET request
const TMDB_API_KEY = 'api_key=44a9a2cde95eface8cfceffc13305aaa';

axios.defaults.baseURL = 'https://api.themoviedb.org/3/'

const useAxiosTMDBSearch = ({ url, method, query, body = null, headers = null, sortByPopularity = false, responseLength }) => {
    const [responsem, setResponse] = useState(null);
    const [errorm, setError] = useState('');
    const [loadingm, setloading] = useState(true);

    const fetchData = () => {
        axios[method](`https://api.themoviedb.org/3/${url}?${TMDB_API_KEY}&query=${query}`, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                console.log("response length: " + responseLength);
                if (sortByPopularity)
                    setResponse(sortResponseByPopularity(res.data['results'], false).splice(0, responseLength));
                else
                    setResponse(res.data['results'].splice(0, responseLength));
            
            })
            .catch((err) => {
                console.log("Erred in search movies");
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    function sortResponseByPopularity(arr, asc = true) {
        return arr.sort((a, b) => {
            let x = a['popularity'];
            let y = b['popularity'];
            if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
            else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
        });
    }

    useEffect(() => {
        fetchData();
    }, [method, url, body, query, headers]);

    return { responsem, errorm, loadingm };
};

export default useAxiosTMDBSearch;