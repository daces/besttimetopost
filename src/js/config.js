export const proxy = 'https://cors-anywhere.herokuapp.com/'
export const instagramUrl = 'https://www.instagram.com/'
export const graphql = 'graphql/query/?'

export const googleUrl = 'https://www.google.com/'

export const regProfilePageURL = /(static\/bundles\/\S*\/ProfilePageContainer.js\/\S*)"/
// export const queryID = /[l\.pagination},queryId:"]([\dabcdef]{32})"/;

export const regQueryID = /profilePosts.byUserId.*.pagination},queryId:"([\dabcdef]{32})"/
// export const queryID = /l.pagination},queryId:"([\dabcdef]{32})"/;
export const regSharedData = /<script type="text\/javascript">window._sharedData = (.*);<\/script>/
