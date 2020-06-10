import axios from "axios"
import { processBestTime } from "./besttime"
import { processHashtags, setupDrawCloud } from "./hashtags"
import { processImages } from "./images"
import {
  instagramUrl,
  graphql,
  regSharedData,
  regProfilePageURL,
  regQueryID
} from '../config'
export function get(username) {
  var sData = {};
  var queryString = {};
  var errorStopCode = false;
  return new Promise(function (resolve, reject) {
    resolve(getProfilePage(username));
  })
    .catch(rejected)

    .then(function (webpage) {
      return sharedData(webpage);
    })
    .catch(rejected)

    .then(function (webpage) {
      return profilePageUrl(webpage);
    })
    .catch(rejected)

    .then(function (webpage) {
      return queryHash(webpage.data);
    })
    .catch(rejected)

    .then(function () {
      return morePosts();
    })
    .then(function (data) {
      return data;
    })
    .catch(rejected)

  function getProfilePage(username) {
    //return axios(`${instagramUrl}${username}/`);
    return axios(`${instagramUrl}${username}/`);
  }

  function sharedData(webpage) {
    if (errorStopCode) return false;
    var tempStorage = JSON.parse(webpage.data.match(regSharedData)[1]);
    console.log(tempStorage);
    sData = tempStorage.entry_data.ProfilePage[0].graphql.user;
    getVariables(sData);
    processBestTime(sData, true);
    processHashtags(sData, true)
    processImages(sData, true)
    return webpage;
  }

  function profilePageUrl(webpage) {
    if (errorStopCode) return false;
    var url = webpage.data.match(regProfilePageURL)[1];
    return axios(`${instagramUrl}${url}`);
  }

  function queryHash(webpage) {
    if (errorStopCode) return false;
    try {
      if (regQueryID.test(webpage)) {
        var queryH = webpage.match(regQueryID)[1];
        queryString.queryHash = queryH;
        return queryH;
      } else
        return 'f045d723b6f7f8cc299d62b57abd500a';
    } catch (error) {
      throw new Error('Higher-level error. ' + error.message);
    }
  }

  function getVariables(my_data) {
    var {
      edge_owner_to_timeline_media: {
        page_info: {
          end_cursor: after,
          has_next_page
        }
      },
      id
    } = my_data || {}
    queryString = {
      variables: {
        id: id,
        first: 12,
        after: after
      },
      has_next_page
    }
    return queryString;
  }

  function time_out() {
    var random = Math.floor(Math.random() * 200 + 100);
    return random;
  }

  async function morePosts() {
    if (errorStopCode) return false;
    var time = time_out();
    var url = `${instagramUrl}${graphql}query_hash=${queryString.queryHash}&variables=${encodeURIComponent(JSON.stringify(queryString.variables))}`;
    var max_limit = 20;
    var postLength = Math.floor(sData.edge_owner_to_timeline_media.count / 12);
    var promiceArray = [];

    for (var i = 0; i <= postLength && i < max_limit; i += 1) {
      promiceArray.push(delay()
        .then(function (data) {
          gatherMedia(data);
          return data;
        })
        .then(function (data) {
          setTimeout(function () {
            processBestTime(data, false)
          }, 1001);
          return data;
        })
        .then(function (data) {
          setTimeout(function () {
            processHashtags(data);
          }, 1250);
          return data;
        })
        .then(function (data) {
          setTimeout(function () {
            processImages(data, false)
          }, 1530);
        }))
    }
    return Promise.all(promiceArray)
      .then(function () {
        //setupDrawCloud();
        return sData;
      })

    function delay() {
      return new Promise(function (resolve) {
        return get_next_posts(resolve);
      });
    }
    function get_next_posts(resolve) {

      setTimeout(function () {
        url = `${instagramUrl}${graphql}query_hash=${queryString.queryHash}&variables=${encodeURIComponent(JSON.stringify(queryString.variables))}`;

        resolve(axios(url));
        //resolve(axios.get(url))//, JSON.stringify(options)));
      }, time += time_out() + 1100);
    }
  }
  /*
      [ 0, 1, 3 ]
      .map( delay )
        .reduce( function ( chain, promice ) {
          return chain
            .then( function ( ) {
              return promice;
            } )
            .then( function processPosts( data ) {
              //console.log( data );
              gatherMedia( data );
              return 1;
            } )
        }, Promise.resolve( ) )
        .then( function ( ) {
          console.log( "Complete" );
          console.log( sData );
        } )
  */


  function gatherMedia(results) {
    var {
      data: {
        data: {
          user: {
            edge_owner_to_timeline_media: {
              page_info,
              edges: media
            }
          }
        }
      }
    } = results || {}
    queryString.variables.after = page_info.end_cursor;
    queryString.has_next_page = page_info.has_next_page;
    sData.edge_owner_to_timeline_media.edges = sData.edge_owner_to_timeline_media.edges.concat(media);
    //console.log( queryString.variables.after );
  }

  function rejected(error) {
    console.error('Error Detected: ', error);
    errorStopCode = true;
    return { profile: "private" };
  }
}
