import { React, useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from 'react-router-dom'
import useAxiosLibraryBooks from "../Hooks/useAxiosLibraryBooks";
import useAxiosGoogleBooks from "../Hooks/useAxiosGoogleBooks";
import "./SearchPage.css";

const SearchPage = () => {

  const [searchKey, setSearchKey] = useState("");
  const [pageNum, setPageNum] = useState(0);

  const [bookDetails, setBookDetails] = useState("");
  const [calls, setCalls] = useState("");

  const location = useLocation();
  const { searchEntry } = location.state;
  console.log("search entry: " + JSON.stringify(searchEntry));

  const { response, loading, error } = useAxiosGoogleBooks({
    method: 'get',
    searchterms: searchEntry,
    specify_type : 'q',
    responseLength: 1000,
});

const { responseb, loadingb, errorb } = useAxiosLibraryBooks({
  method: 'get',
  key: searchKey,
});

const setBookCard = (key, author, title) => {

  console.log("Inside set book card");
  if(!loadingb && responseb)
  {
    var image = "https://covers.openlibrary.org/b/ID/" + responseb.covers[0] + "-M.jpg";
    console.log("Image: " + image);
    var bookTitle = responseb.title;
    var bookAuthor = author;
    var publisher = response.publisher;
    var description = responseb.description.value;

    return (
      <div>
        {
          (responseb.map(book => (
            <><div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img src={image} alt="Cover Image" style={{width:300, height:300}}></img>
                  </div>
                <div class="flip-card-back">
                  <h3>{book.title}</h3>
                  <p>{book.author_name}</p>
                </div>
              </div>
            </div></>

          )))
        }
      </div>
    )
  }
}

  // gets title/author for every book
  const renderSearchList = (res) => {
    let loadBooks = []
    if (!loading && res) {
      res.docs.map( function(book) {
        // basically we only want to get books that display the cover
        if(typeof book === "object")
        {
          if( typeof book.cover_i === "number")
          {
            console.log("book type: " + typeof book);
            console.log("cover_i: " + typeof book.cover_i);
            console.log("book in add books: " + book.cover_i)
            loadBooks.push(
              
              <div class="flip-card" style={{ display: 'inline-block' }}>
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <img src={"https://covers.openlibrary.org/b/ID/" + book.cover_i + "-M.jpg"} alt="Cover Image" style={{ width: 180, height: 272 }}></img>
                  </div>
                  <div class="flip-card-back">
                    <h3>{book.title}</h3>
                    <p>{book.author_name}</p>
                  </div>
                </div>
              </div>
            );
          }
        }

    });
    if(!loading && res)
    {
      return (
        <div >
          {
            <><table>
              <tr>
                <th>Results</th>
              </tr>
              {DisplayTable(loadBooks, 4, 12)}
              <tr >
              </tr>
            </table>
              <nav aria-label="...">
                <ul class="pagination">
                  {DisplayFooter(loadBooks.length, 4, 12)}
                </ul>
              </nav>
              </>
          }
        </div>
      )

    }
    }
  };

  useEffect(() => {
  }, [loading, error]);

    // mediaList: contains media to display
  // rowNum: the number of media to display in each row
  // displayNum: total number of media to display
  const DisplayTable = (mediaList, rowNum, displayNum) => {
    let mediaCount = mediaList.length;
    let currLoc = pageNum * displayNum;
    let maxlength = currLoc + displayNum;
    let result = [];
    // ensure we don't try to access outside of length of media
    if(maxlength > mediaCount)
      maxlength = mediaCount;
    for(let i = currLoc; i < maxlength; i += rowNum)
    {    
      let j = i;  
          result.push(
            <tr>
            {
              <>
                <td> {mediaList[j]} </td>
                <td> {mediaList[j+1]} </td>
                <td> {mediaList[j+2]} </td>
                <td> {mediaList[j+3]} </td>
              </>                  
            }
          </tr>
          )
    }
    return result;
  }

  const DisplayFooter = (mediaCount, rowLength, displayLength) =>
  {
    // get how many pages there are
    let numPagesDis = mediaCount/displayLength;
    let result = [];
    if (pageNum > 0) {
      result.push(
        <li class="page-item">
          <a class="page-link" href="#" onClick={() => setPageNum(pageNum - 1)}>Previous</a>
        </li>
      )
    }
    else {
      result.push(
        <li class="page-item disabled">
        <span class="page-link">Previous</span>
      </li>
      )
    }
    
    // add current page, page 0, and max page to footer
    result.push(
      <li class="page-item ">
        <span class="page-link" onClick={() => setPageNum(0)}>
          {1}
        </span>
      </li>
    );
    result.push(
      <li class="page-item active">
        <span class="page-link" >
          {pageNum+1}
        </span>
      </li>
    );
    result.push(
      <li class="page-item ">
        <span class="page-link" onClick={() => setPageNum(Math.round(numPagesDis-1))}>
          {Math.round(numPagesDis)}
        </span>
      </li>
    );

    if (pageNum < numPagesDis-1) {
      result.push(
        <li class="page-item">
        <a class="page-link" href="#" onClick={() => setPageNum(pageNum+1)}>Next</a>
      </li>
      )
    }
    else {
      result.push(
        <li class="page-item disabled">
        <span class="page-link">Next</span>
      </li>
      )
    }

    return result;
  }

  return (
    <>
      <Navbar />
      <div>
        <h5 class="SearchTitle"> Search Page</h5>
        {renderSearchList(response)}
      </div>
    </>
  )
};


export default SearchPage;