import React from "react";
import { Link } from "react-router-dom";
import "./CollectionList.css";
import "../Screens/Collections.css";
import "./TrendingBooks.css";

function DummyCollectionData(props) {

    const book = {
        bookAuthor: "Louise Penny",
        bookTitle: "A WORLD OF CURIOSITIES",
        description: "The 18th book in the Chief Inspector Gamache series. When an attic room that was sealed off 160 years ago is opened, an old enemy returns.",
        image: "https://storage.googleapis.com/du-prd/books/images/9781250145291.jpg",
        isbn_10: "1250145317",
        isbn_13: "9781250145314",
        publisher: "Minotaur",
        purchaseLinks: [
            { name: 'Amazon', url: 'https://www.amazon.com/dp/1250145295?tag=NYTBSREV-20' },
            { name: 'Apple Books', url: 'https://goto.applebooks.apple/9781250145314?at=10lIEQ' },
            { name: 'Barnes and Noble', url: 'https://www.anrdoezrs.net/click-7990613-11819508?u...w.barnesandnoble.com%2Fw%2F%3Fean%3D9781250145314' }
        ]
    }
    // These datas are for filling in the pages and should be fetched from the db in the future

    if (props.name === "item1") {
        return (
            <>
                <h4 className="myCollectionsHeader">{props.title}</h4>
                <div class="scroll__wrap">
                    {
                        <div className="bookDiv">
                            <div className="bookImageDiv">
                                <Link to="/secondary-book-page" state={{ bookDetails: { book } }}>
                                    {<img src={book.image} height="200" width="150" />}
                                </Link>
                            </div>
                        </div>
                    }
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <h4 className="myCollectionsHeader">{props.name}</h4>
                <div class="scroll__wrap">
                    {data.map(d => (
                        <button class="scroll--element" id={d.name}>
                            {props.name}: {d.name}
                        </button>
                    ))}
                </div>
            </>
        );
    }
};


export default DummyCollectionData;
