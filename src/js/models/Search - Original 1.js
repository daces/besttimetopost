import axios from 'axios'
import {
  instagramUrl,
  graphql,
  regSharedData,
  regProfilePageURL,
  regQueryID
} from '../config'

export function get( username ) {
  var sData = {};
  var queryString = {};
  return new Promise( function ( resolve ) {
      resolve( getProfilePage( username ) );
    } )
    .catch( rejected )

    .then( function ( webpage ) {
      return sharedData( webpage );
    } )
    .catch( rejected )

    .then( function ( webpage ) {
      return profilePageUrl( webpage );
    } )
    .catch( rejected )

    .then( function ( webpage ) {
      return queryHash( webpage.data );
    } )
    .catch( rejected )

    .then( function ( ) {
      return morePosts( );
    } )
    .catch( rejected )

  function getProfilePage( username ) {
    return axios( `${instagramUrl}${username}/` );
  }

  function sharedData( webpage ) {
    var tempStorage = JSON.parse( webpage.data.match( regSharedData )[ 1 ] );
    sData = tempStorage.entry_data.ProfilePage[ 0 ].graphql.user;
    getVariables( sData );
    return webpage;
  }

  function profilePageUrl( webpage ) {
    var url = webpage.data.match( regProfilePageURL )[ 1 ];
    return axios( `${instagramUrl}${url}` );
  }

  function queryHash( webpage ) {
    try {
      if ( regQueryID.test( webpage ) ) {
        var queryH = webpage.match( regQueryID )[ 1 ];
        queryString.queryHash = queryH;
        return queryH;
      } else
        return 'f045d723b6f7f8cc299d62b57abd500a';
    } catch ( error ) {
      throw new Error( 'Higher-level error. ' + error.message );
    }
  }

  function getVariables( my_data ) {
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

  function morePosts( ) {
    var time = time_out( );
    var url = `${instagramUrl}${graphql}query_hash=${queryString.queryHash}&variables=${encodeURIComponent(JSON.stringify(queryString.variables))}`;

    function delay( ) {
      return new Promise( function ( resolve ) {
        get_next_posts( resolve );
      } );
    }

    function time_out( ) {
      var random = Math.floor( Math.random( ) * 200 + 100 );
      return random;
    }

    function get_next_posts( resolve ) {
      setTimeout( function ( ) {
        url = `${instagramUrl}${graphql}query_hash=${queryString.queryHash}&variables=${encodeURIComponent(JSON.stringify(queryString.variables))}`;
        console.log( decodeURIComponent( url ) );
        resolve( axios( url ) );
      }, time += time_out( ) + 1000 );
    }

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
  }



  function gatherMedia( results ) {
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
    sData.edge_owner_to_timeline_media.edges = sData.edge_owner_to_timeline_media.edges.concat( media );
    //console.log( queryString.variables.after );
  }

  function rejected( error ) {
    console.log( 'Error Detected: ', error );
    return error;
  }
}
