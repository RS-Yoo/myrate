import { React, useEffect, useState } from "react";
import NavbarM from "../Components/Navbar";
import { useLocation } from 'react-router-dom'
import useAxiosLibraryBooks from "../Hooks/useAxiosLibraryBooks";
import useAxiosGoogleBooks from "../Hooks/useAxiosGoogleBooks";
import useAxiosTMDBSearch from "../Hooks/useAxiosTMDBSearch";
import "./SearchPage.css";
import SearchBox from "../Components/SearchBox";
import { useNavigate } from 'react-router-dom';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SearchPage = () => {

  const [searchKey, setSearchKey] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [mediaType, setMedia] = useState("Movies");

  const [bookDetails, setBookDetails] = useState("");
  const [calls, setCalls] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { searchEntry } = location.state;
  console.log("search entry: " + JSON.stringify(searchEntry));

  // Base URL that needs to be pre-pended to 'poster_path'
  const prePosterPath = "https://image.tmdb.org/t/p/original";

  const { responsem, loadingm, errorm } = useAxiosTMDBSearch({
    method: 'get',
    url: `search/movie`,
    query: searchEntry,
    sortByPopularity: true,
    responseLength: 1000,
  });

  const { responset, loadingt, errort } = useAxiosTMDBSearch({
    method: 'get',
    url: `search/tv`,
    query: searchEntry,
    sortByPopularity: true,
    responseLength: 1000,
  });


  const { response, loading, error } = useAxiosGoogleBooks({
    method: 'get',
    searchterms: searchEntry,
    specify_type: 'q',
    responseLength: 1000,
  });

  const { responseb, loadingb, errorb } = useAxiosLibraryBooks({
    method: 'get',
    key: searchKey,
  });

  function findMovie(movie) {
    navigate(`/secondary-movie-page/${movie['id']}`, { state: { movieDetails: { movie } } });
  }

  function findTV(tvshow) {
    navigate(`/secondary-tv-page/${tvshow['id']}`, { state: { tvDetails: { tvshow } } });
  }

  async function findBook (inputKey, author, cover) {
    setSearchKey(inputKey);
    console.log("beresponse: " + responseb);
    
    secondfindbook(author, cover);     

}
function secondfindbook(author, cover) {
  if(!loadingb)
  {
    console.log("amazon.com/dp/" + response.docs[0].isbn[0]);//JSON.stringify(response));
      var image = cover;
      var bookTitle = responseb.title;
      var bookAuthor = author;
      var publisher = response.publisher;
      var description = ""; //responseb.description.value;
      try {
        description = responseb.description.value;
      }
      catch{
        description = "No description available.";
      }
      var links = [];
      try {
        var amazonlink = "amazon.com/dp/" + response.docs[0].isbn[0];
        links.push({name: "Amazon" , url: amazonlink});
      }
      catch {

      }

      const bookDetails = {book : {image: image, bookTitle: bookTitle, bookAuthor: bookAuthor, publisher: publisher, isbn_10: responseb.isbn_10, isbn_13: responseb.isbn_13, description: description, purchaseLinks: links}}
      
      console.log("details: " + JSON.stringify(bookDetails));
      
      navigate('/secondary-book-page', { state : {bookDetails}} );
  }
}


  // gets title/author for every book
  const renderSearchList = (res) => {
    if (mediaType === "Books") {
      let loadBooks = []
      if (!loading && res) {
        res.docs.map(function (book) {
          // basically we only want to get books that display the cover
          if (typeof book === "object") {
            if (typeof book.cover_i === "number") {
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
                      <button onClick={() => findBook(book.key, book.author_name, "https://covers.openlibrary.org/b/ID/" + book.cover_i + "-M.jpg")}>View Book</button>
                    </div>
                  </div>
                </div>
              );
            }
          }

        });
        if (!loading && res) {
          return (
            <div >
              {
                <><table>
                  <tr>
                    <th>Results</th>
                  </tr>
                  {DisplayTable(loadBooks, 8, 32)}
                  <tr >
                  </tr>
                </table>
                  <nav aria-label="...">
                    <ul class="pagination">
                      {DisplayFooter(loadBooks.length, 8, 32)}
                    </ul>
                  </nav>
                </>
              }
            </div>
          )

        }
      }
    }
    else if (mediaType === "Movies") {
      let loadMovies = []
      if (!loadingm && responsem) {
        responsem.map(function (movie) {

          loadMovies.push(

            <div class="flip-card" style={{ display: 'inline-block' }} >
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img src={`${prePosterPath}${movie['poster_path']}`} alt="Poster Image" style={{ width: 180, height: 272 }}></img>
                </div>
                <div class="flip-card-back">
                  <h3>{movie.original_title}</h3>
                  <button onClick={() => findMovie(movie)}>View Movie</button>
                </div>
              </div>
            </div>
          );
        });
        if (!loadingm && responsem) {
          return (
            <div >
              {
                <><table>
                  <tr>
                    <th>Results</th>
                  </tr>
                  {DisplayTable(loadMovies, 8, 32)}
                  <tr >
                  </tr>
                </table>
                  <nav aria-label="...">
                    <ul class="pagination">
                      {DisplayFooter(loadMovies.length, 8, 32)}
                    </ul>
                  </nav>
                </>
              }
            </div>
          )

        }
      }

    }
    else if(mediaType === "TV Shows")
    {
      let loadTV = []
      console.log(responset);
      if (!loadingt && responset) {
        responset.map(function (tvshow) {

          loadTV.push(

            <div class="flip-card" style={{ display: 'inline-block' }} >
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img src={`${prePosterPath}${tvshow['poster_path']}`} alt="Poster Image" style={{ width: 180, height: 272 }}></img>
                </div>
                <div class="flip-card-back">
                  <h3>{tvshow.name}</h3>
                  <button onClick={() => findTV(tvshow)}>View TV Show</button>
                </div>
              </div>
            </div>
          );
        });
        if (!loadingt && responset) {
          return (
            <div >
              {
                <><table>
                  <tr>
                    <th>Results</th>
                  </tr>
                  {DisplayTable(loadTV, 4, 12)}
                  <tr >
                  </tr>
                </table>
                  <nav aria-label="...">
                    <ul class="pagination">
                      {DisplayFooter(loadTV.length, 4, 12)}
                    </ul>
                  </nav>
                </>
              }
            </div>
          )

        }
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
    if (maxlength > mediaCount)
      maxlength = mediaCount;
    for (let i = currLoc; i < maxlength; i += rowNum) {
      let j = i;
      result.push(
        <tr>
          {
            <>
              <td> {mediaList[j]} </td>
              <td> {mediaList[j + 1]} </td>
              <td> {mediaList[j + 2]} </td>
              <td> {mediaList[j + 3]} </td>
              <td> {mediaList[j + 4]} </td>
              <td> {mediaList[j + 5]} </td>
              <td> {mediaList[j + 6]} </td>
              <td> {mediaList[j + 7]} </td>

            </>
          }
        </tr>
      )
    }
    return result;
  }

  const DisplayFooter = (mediaCount, rowLength, displayLength) => {
    // get how many pages there are
    let numPagesDis = mediaCount / displayLength;
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
          {pageNum + 1}
        </span>
      </li>
    );
    result.push(
      <li class="page-item ">
        <span class="page-link" onClick={() => setPageNum(Math.round(numPagesDis - 1))}>
          {Math.round(numPagesDis)}
        </span>
      </li>
    );

    if (pageNum < numPagesDis - 1) {
      result.push(
        <li class="page-item">
          <a class="page-link" href="#" onClick={() => setPageNum(pageNum + 1)}>Next</a>
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

  function handleKeyDown (e) {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }

  function refreshMedia(e) {
    setMedia(e);
  }



  return (
    <>
      <NavbarM />
      <div>
      
      <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className='pe-5'>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title={mediaType}
                menuVariant="dark"
              >
                <NavDropdown.Item onClick={() => refreshMedia("Books")}>Books</NavDropdown.Item>
                <NavDropdown.Item onClick={() => refreshMedia("Movies")}>Movies</NavDropdown.Item>
                <NavDropdown.Item onClick={() => refreshMedia("TV Shows")}>TV Shows</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="w-75 d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {renderSearchList(response)}
                                                                            
      </div>
    </>
  )
};


export default SearchPage;