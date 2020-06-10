import { get } from './models/Search'
import { getUserInput } from './views/resultsView'

bestTimeToPost();

function bestTimeToPost() {
  var username = serialize(getUserInput())

  function serialize(input) {
    return String(input)
  }
  console.log(username);
  if (username) {
    var p = Promise.resolve(get(username))
    p.then(function (data) {
      console.log(data);

    })
  }
}




