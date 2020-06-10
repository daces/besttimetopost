/* eslint-disable no-prototype-builtins */
import React from 'react';
import ReactDOM from 'react-dom'
/*import * as d3 from 'd3'
import { cloud } from '../d3-layout'*/
var hashTagContainer = [];

//processHashtags(allData, true);
export function processHashtags(data, first12) {
  if (!isntObject(data))
    return function () { console.log("error", data); };
  data = first12 ? data.edge_owner_to_timeline_media : data.data.data.user.edge_owner_to_timeline_media;
  var regexOnlyHashtags = /#[a-zA-Z0-9]+/gm;
  if (typeof data == "undefined")
    return false;
  data.edges.forEach(element => {
    if (!isntObject(element))
      return false
    if (element.node.edge_media_to_caption.edges[0] !== undefined) {
      var caption = element.node.edge_media_to_caption.edges[0].node.text;
      var hashtagArray = [];
      if (caption.indexOf("#") !== -1) {
        if (regexOnlyHashtags.test(caption) == true) {
          hashtagArray = caption.match(regexOnlyHashtags);
          hashtagArray.forEach(hashtag => {
            if (hashTagContainer.hasOwnProperty(hashtag) == false) {
              hashTagContainer[hashtag] = 1;
            }
            if (hashTagContainer.hasOwnProperty(hashtag)) {
              hashTagContainer[hashtag] += 1;
            }
          });
        }
      }
    }
  });
  hashTagContainer[" "] = 100;
  function isntObject(obj) {
    if (obj === null)
      return false;
    return typeof (obj) === "object"
      && Array.isArray(obj) === false;
  }
  function App() {
    return <div>
      <div>
        {Object.entries(hashTagContainer).map((obj, index) => {
          if (obj[1] == 100)
            obj[1] = 0;
          return <span className="hashtag" key={index} style={{ "fontSize": obj[1] < 42 ? (obj[1] + 10 + "px") : obj[1] + "px" }}> {obj[0]}
          </span>
        })}
      </div>
    </div>
  }

  ReactDOM.render(< App />,
    document.getElementById("react-app-hashtags"),
  );
}
//setupDrawCloud()
/*
export function setupDrawCloud() {
  var sex = Object.entries(hashTagContainer).sort(sortByLikeAsc)
    .map(function (hash) {
      return { text: hash[0], size: hash[1] }
    })
  drawCloud(sex);
}

function drawCloud(data) {
  var width = window.innerWidth - 25;
  var height = 400;
  var hashtagScale = d3.scaleLinear().range([20, 120]);
  hashtagScale.domain([
    d3.min(data, function (d) { return d.size; }),
    d3.max(data, function (d) { return d.size; })
  ])
  var layout = cloud()
    .size([width, height])
    .words(data)
    .padding(0)
    //.rotate(function () { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function (d) { return hashtagScale(d.size); })
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#word-cloud").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function (d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .style("fill", function () { return hslColor(); })
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) { return d.text; });
  }

}

function hslColor() {
  var rgb = Math.floor(Math.random() * 360, 1);
  return `hsl(${rgb}, 100%, 83%)`
}
*/

function sortByLikeAsc(a, b) {
  if (a[1] < b[1])
    return 1;
  if (a[1] > b[1])
    return -1;
  else
    return 0
}