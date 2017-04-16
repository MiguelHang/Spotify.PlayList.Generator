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
