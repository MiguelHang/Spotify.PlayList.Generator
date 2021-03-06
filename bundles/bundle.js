'use strict';
let app = angular.module('appSPG', ['ui.router', 'ui.bootstrap'])

app.constant('settings', {
	baseservice: 'https://api.spotify.com/v1/',
	clientId: 'feb48bf632e846b88e881da5fbd28822'
})

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider) => {
	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: 'app/modules/home/home.html',
		controller:   'HomeCtrl'
	})
	.state('home.playlist', {
		url: 'playlist/',
		templateUrl: 'app/modules/playlist/playlist.html',
		controller: 'PlaylistCtrl'
	})
	$locationProvider.html5Mode(true)
}]);

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
			 $scope.$broadcast ('check')
			 $state.go('home.playlist')

		}

		$scope.trustSrc = (src) => {
    		return $sce.trustAsResourceUrl(src);
  		}
	}
})();

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

( () => {
  app.controller('PlaylistCtrl', playlistCtrl)
  playlistCtrl.$inject = ['$scope', '$state', '$sce', 'Playlist', '$interval']

  function playlistCtrl ($scope, $state, $sce, Playlist, $interval){

    $scope.playlists = Playlist
		$scope.iframeUrl = {url:''}
    $scope.showClear = true
    $scope.load = false

    $scope.loading = () => {
      $scope.load = true
    }

    if($scope.playlists.length != 0){//only first time
      $scope.iframeUrl.url = $scope.playlists[$scope.playlists.length-1].Url
      $interval(function() {
         $scope.loading();
      },1500);
    }

    $scope.$on('check', () => {
      if($scope.playlists.length != 0){
        $scope.iframeUrl.url = $scope.playlists[$scope.playlists.length-1].Url
        $interval(function() {
           $scope.loading();
        },1500);
      }
    });

    $scope.open = data =>{
      $scope.iframeUrl.url = data
    }
    $scope.reset = () =>{
      $scope.playlists = []
      $scope.iframeUrl.url = ''
      $scope.showClear = false
      Playlist.reset()
      $state.go('home')
    }
    $scope.trustSrc = (src) => {
        return $sce.trustAsResourceUrl(src);
      }
  }
})();
