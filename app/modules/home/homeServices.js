( () => {
	app.service('HomeServices', homeServices)
	homeServices.$inject = ['$http', 'settings']

	function homeServices($http, settings) {
		let url = 'https://api.spotify.com/v1/'

		this.getArtist = param => {
			let urlGetID = url +'search?q='+ param + '&type=artist'
			return $http.get(urlGetID).then( response => {
				return response.data
			})
		}
		this.getArtistsAlbums = param => {
			let urlGetAlbums = url + 'artists/' + param + '/albums'
			return $http.get(urlGetAlbums).then( response => {
				return response.data
			})
		}
		this.getAlbumTracks = params => {
			let urlGetTracks = url + 'albums/' + params + '/tracks'
			return $http.get(urlGetTracks).then( response =>{
				return response.data
			})
		}

	}
})();
