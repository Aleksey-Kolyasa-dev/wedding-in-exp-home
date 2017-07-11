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
		'wedServices',
		'wedDerictives'
	]);

	wedInApp.config(['$routeProvider',function ($routeProvider) {

		$routeProvider.when('/index', {
			templateUrl : '/views/main_page/00_main_page.html'
		}).when('/project', {
            templateUrl : '/views/projects/00_projects_main.html'
        })

	}]);

	
	return wedInApp;
});

