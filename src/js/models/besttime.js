import React from 'react';
import ReactDOM from 'react-dom'
import * as dayjs from 'dayjs'


//var day = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
var sunday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var monday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tuesday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var wednesday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var thursday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var friday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var saturday = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//processBestTime(allData, true)
export function processBestTime(posts, first) {
  function isntObject(obj) {
    if (obj == null)
      return false;
    return typeof obj == "object" && Array.isArray(obj) === false;
  }
  if (!isntObject(posts)) {
    return false;
  }
  posts = first ? posts : posts.data.data.user;
  var {
    edge_owner_to_timeline_media: {
      edges: media
    }
  } = posts || {};

  var timetime = media.map(function (value) {
    var days = dayjs(value.node.taken_at_timestamp * 1000).format("M/d/H/m/Z").split("/")
    var day = days[1];
    var dayIndex = Number(days[2]);
    if (day === "0")
      sunday[dayIndex] += 1;
    if (day === "1")
      monday[dayIndex] += 1;
    if (day === "2")
      tuesday[dayIndex] += 1;
    if (day === "3")
      wednesday[dayIndex] += 1;
    if (day === "4")
      thursday[dayIndex] += 1;
    if (day === "5")
      friday[dayIndex] += 1;
    if (day === "6")
      saturday[dayIndex] += 1;
    return timetime;
  })

  function App() {
    function dailyHours(day, value, key) {
      if (value == 0)
        return <span className="cell white" key={day + key} ></span>
      return <span style={{ background: `hsla(0, 100%, ${96 - (value + 5)}%, 1)` }} className="cell" key={day + key} > {value}</span>
      //return <span style={{ background: `rgba(244,0,0,${value * 10}%)` }} className="cell" key={day + key} > {value}</span>
    }
    return <div className="wrapper">

      <div className="wrap-days" >
        <div className="days" >
          <span className="day-cell" key={"dh"} ></span>
          <span className="day-cell" key={"d0"} >Sun</span>
          <span className="day-cell" key={"d1"} >Mon</span>
          <span className="day-cell" key={"d2"} >Tue</span>
          <span className="day-cell" key={"d3"} >Wed</span>
          <span className="day-cell" key={"d4"} >Thu</span>
          <span className="day-cell" key={"d5"} >Fri</span>
          <span className="day-cell" key={"d6"} >Sat</span>
        </div >
      </div >
      <div className="all-hours" >
        <div className="hours" >
          {sunday.map(function (values, index) {
            return <span className="cell" key={"h" + index} >{index > 12 ? `${index}PM` : `${index}AM`}</span>
          })}
        </div>
      </div>
      <div className="wrap-week">
        <div className="week">
          <div className="sunday" title="sunday">
            {sunday.map(function (values, index) {
              return dailyHours("su", values, index);
            })}
          </div >
          <div className="monday" title="monday">
            {monday.map(function (values, index) {
              return dailyHours("mo", values, index);
            })}
          </div >
          <div className="tuesday" title="tuesday">
            {tuesday.map(function (values, index) {
              return dailyHours("tu", values, index);
            })}
          </div >
          <div className="wednesday" title="wednesday">
            {wednesday.map(function (values, index) {
              return dailyHours("we", values, index);
            })}
          </div >
          <div className="thursday" title="thursday">
            {thursday.map(function (values, index) {
              return dailyHours("th", values, index);
            })}
          </div >
          <div className="friday" title="friday">
            {friday.map(function (values, index) {
              return dailyHours("fr", values, index);
            })}
          </div >
          <div className="saturday" title="saturday">
            {saturday.map(function (values, index) {
              return dailyHours("sa", values, index);
            })}
          </div >
          <div className="clear-fix"></div>
        </div >
      </div >
      <div className="clear-fix"></div>
    </div>

  }

  ReactDOM.render(< App />,
    document.getElementById("react-app"),
  );
}
