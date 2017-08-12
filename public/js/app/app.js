define([
	'angular',
	'jQueryUI',
	'jQuery',
    'angularRoute',
	'angularAnimate',
	'angularToastr',
	'twitterBootstrap',
	'services',
	'controllers',
	'newProjectCtrlModule',
	'budgetCtrlModule',
	'restaurantCtrlModule',
	'decorCtrlModule',
	'flowerCtrlModule',
	'leaderCtrlModule',
	'musicCtrlModule',
    'photoCtrlModule',
    'videoCtrlModule',


	'directives',
	'angularRuLocale'
], function(angular){
	"use strict";
	/*Define main APP MODULE*/
	var wedInApp = angular.module('wedInApp', [
        'ngRoute',
		'ngAnimate',
        'toastr',
        'wedControllers',
		'newProjectCtrlModule',
		'budgetCtrlModule',
		'restaurantCtrlModule',
		'decorCtrlModule',
		'flowerCtrlModule',
		'leaderCtrlModule',
		'musicCtrlModule',
        'photoCtrlModule',
        'videoCtrlModule',


		'wedServices',
		'wedDerictives'
	]);

	wedInApp.config(['$routeProvider',function ($routeProvider) {

		$routeProvider.when('/start', {
            templateUrl : '/views/start_page/00_home_page.html'
        }).when('/index', {
			templateUrl : '/views/home_page/00_home_page.html'
		}).when('/project', {
            templateUrl : '/views/projects/00_projects_main.html'
        }).otherwise({
        	template : "<h1 style='color: #ffffff;'>404 Not Found By Me!</h1>"
		});

	}]);

	
	return wedInApp;
});

