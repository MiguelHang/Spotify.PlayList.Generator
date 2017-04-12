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
	$locationProvider.html5Mode(true)
}]);
