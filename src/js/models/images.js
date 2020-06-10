import React, { useState } from "react";
import ReactDOM from "react-dom";

var allImages = [];
var tenAtTime = 0;

//processImages(allData, true);
export function processImages(data, first) {
  console.log(data)
  if (!isntObject(data))
    return function () { console.log("error", data); };
  data = first ? data.edge_owner_to_timeline_media : data.data.data.user.edge_owner_to_timeline_media;
  if (typeof data == "undefined")
    return false;
  data = data.edges.map(collectImageLikeComment);

  if (typeof allImages !== undefined)
    allImages = [...allImages, ...data]
  allImages = allImages.sort(sortByLikeAsc);
  if (first == true) {
    renderImages();
  }

  function isntObject(obj) {
    if (obj === null)
      return false;
    return typeof (obj) === "object"
      && Array.isArray(obj) === false;
  }

  function collectImageLikeComment(post) {
    return {
      likes: post.node.edge_media_preview_like.count || 0,
      comments: post.node.edge_media_to_comment.count || 0,
      image: post.node.thumbnail_src || ""
    };
  }

  function sortByLikeAsc(a, b) {
    if (a.likes < b.likes)
      return 1;
    if (a.likes > b.likes)
      return -1;
    else
      return 0
  }

  function sortByCommentAsc(a, b) {
    if (a.comments < b.comments)
      return 1;
    if (a.comments > b.comments)
      return -1;
    else
      return 0
  }

  function renderImages() {
    function Images(props) {
      return <div className="images">
        {props.imageArray.map(function (post, index) {
          return <div className="box column is-pulled-left is-one-third" key={"img" + index} >
            <img src={post.image} />
            <span className="images__box">
              <img className="images__box_img" src="./img/like.png" />
              <span className="images__box_like">{post.likes}</span>
            </span>
            <span className="images__box">
              <img className="images__box_img" src="./img/chat.png" />
              <span className="images__box_comment">{post.comments}</span>
            </span>
          </div>
        })
        }
      </div>
    }

    function App() {
      var [tenImagesArray, setImageArray] = useState(getNext10Images)

      function setTenImagesArray() {
        setImageArray(getNext10Images)
      }

      function getNext10Images() {
        return allImages.slice(0, tenAtTime += 10)
      }

      function sortByLikes() {
        allImages = allImages.sort(sortByCommentAsc);
        allImages = allImages.sort(sortByLikeAsc);
        setImageArray(allImages);
      }

      function sortByComments() {
        allImages = allImages.sort(sortByLikeAsc);
        allImages = allImages.sort(sortByCommentAsc);
        setImageArray(allImages);
      }
      return <div>
        <div><Images imageArray={tenImagesArray} />
          <div className="section clear-fix has-text-centered">
            <button className="button" onClick={setTenImagesArray}>Show More</button>
          </div>
        </div>
      </div>
    }

    ReactDOM.render(<App />,
      document.getElementById("react-app-images")
    );
  }
}