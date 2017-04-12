( () => {
  app.controller('PlaylistCtrl', playlistCtrl)
  playlistCtrl.$inject = ['$scope', '$state', '$sce', 'Playlist']

  function playlistCtrl ($scope, $state, $sce, Playlist){

    $scope.playlists = Playlist
		$scope.iframeUrl = {url:''}

    $scope.open = data =>{
      $scope.iframeUrl.url = data
    }
    $scope.reset = () =>{
      $scope.playlists = []
      $scope.iframeUrl = {url:''}
      Playlist.reset()
    }
    $scope.trustSrc = (src) => {
        return $sce.trustAsResourceUrl(src);
      }
  }
})();
