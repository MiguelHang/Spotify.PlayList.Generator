( () => {
  app.controller('PlaylistCtrl', playlistCtrl)
  playlistCtrl.$inject = ['$scope', '$state', '$sce', 'Playlist']

  function playlistCtrl ($scope, $state, $sce, Playlist){

    $scope.playlists = Playlist
		$scope.iframeUrl = {url:''}
    $scope.showClear = true
    
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
