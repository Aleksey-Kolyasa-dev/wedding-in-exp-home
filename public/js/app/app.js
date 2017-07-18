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
	'restaurantCtrlModule',
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
		'restaurantCtrlModule',
		'wedServices',
		'wedDerictives'
	]);

	wedInApp.config(['$routeProvider',function ($routeProvider) {

		$routeProvider.when('/index', {
			templateUrl : '/views/home_page/00_home_page.html'
		}).when('/project', {
            templateUrl : '/views/projects/00_projects_main.html'
        })

	}]);

	
	return wedInApp;
});

