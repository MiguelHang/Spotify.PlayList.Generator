( () => {
  app.factory('Playlist', playlist)

  function playlist() {

    let playlists = []

    playlists.setData = (url, name) => {
      let ObjP = {Url: url, Name: name}
      playlists.push(ObjP)
    }
    playlists.reset = () => {
      playlists.length = 0
    }

    return playlists
  }
})();
