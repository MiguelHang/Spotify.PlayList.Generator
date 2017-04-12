( () => {
	app.controller('HomeCtrl', homeCtrl)
	homeCtrl.$inject = ['$scope', '$state', 'HomeServices', '$q', '$sce', 'Playlist']


	function homeCtrl($scope, $state, HomeServices, $q, $sce, Playlist){

		$scope.searchParams = ''
		$scope.artistsId = []
		$scope.albumsIDs = []
		$scope.tracksIDs = []
		$scope.baseUrl = 'https://embed.spotify.com/?theme=white&uri=spotify:trackset:'
		$scope.playlistName = ''
		$scope.showPlaylist = false
		$scope.iframeUrl = {url: ''}

		$scope.search = () => {
			// clear
			$scope.artistsId = []
			$scope.albumsIDs = []
			$scope.tracksIDs = []
			//create
			let artists = $scope.searchParams.split(",")
			let Ids = artists.map( artistName => HomeServices.getArtist(artistName).then( response => {
				if(response.artists.items.length == 0){
					swal('Artista ' + artistName + ' no encontrado', 'error')
				}
					$scope.artistsId.push(response.artists.items[0].id)
			}))
			return $q.all(Ids).then( response => {
				$scope.getAlbums()
			})
		}

		$scope.getAlbums = () => {
			let Albums = $scope.artistsId.map( artistsAlbums => HomeServices.getArtistsAlbums(artistsAlbums).then( response => {
						$scope.albumsIDs.push(response.items)

			}))
			return $q.all(Albums).then( response => {
				$scope.getTracks($scope.albumsIDs.reduce((prev, curr) => [...prev,...curr], []))
				// console.log($scope.albumsIDs.reduce((prev, curr) => [...prev,...curr], []))
			})
		}

		$scope.getTracks = (data) => {
			let Tracks = data.map(tracksId => HomeServices.getAlbumTracks(tracksId.id).then( response => {
						$scope.tracksIDs.push(response.items)
			}))
			return $q.all(Tracks).then( response => {
				$scope.getSonsgs($scope.tracksIDs.reduce((prev, curr) => [...prev,...curr], []))
				// console.log($scope.tracksIDs.reduce((prev, curr) => [...prev,...curr], []))
			})
		}

		$scope.getSonsgs = (data) => {
			let Songs = data.map(songsId => songsId.id)
			let randomTracks= $scope.getRandomTracks(50, Songs)
			$scope.createPlayList(randomTracks)
		}

		$scope.getRandomTracks = (num, tracks) => {
			const randomResult = []
			for (var i = 0; i < num; i++) {
				randomResult.push(tracks[Math.floor(Math.random() * tracks.length)])
			}
			return randomResult
		}

		$scope.createPlayList = data => {
			let song = data.join(',')
			 $scope.showPlaylist = true
			 $scope.iframeUrl.url = $scope.baseUrl + $scope.playlistName + ':' + song
			//  console.log($scope.iframeUrl.url)
			 Playlist.setData($scope.iframeUrl.url, $scope.playlistName)
			 $scope.searchParams = ''
			 $scope.playlistName = ''
			 $state.go('home.playlist')

		}

		$scope.trustSrc = (src) => {
    		return $sce.trustAsResourceUrl(src);
  		}
	}
})();
