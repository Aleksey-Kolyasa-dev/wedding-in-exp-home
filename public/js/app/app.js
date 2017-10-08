define([
	'angular',
	'jQueryUI',
	'jQuery',
    'angularRoute',
	'angularAnimate',
	'angularToastr',
	'twitterBootstrap',

	'socials',

	'projServices',
	'authServices',

	'controllers',
	'usersCtrlModule',
    'adminCtrlModule',
	'newProjectCtrlModule',

	'budgetCtrlModule',
	'restaurantCtrlModule',
	'arrangementCtrlModule',
    'programCtrlModule',
    'filmingCtrlModule',
    'registrationCtrlModule',
    'marriageCtrlModule',
    'transportCtrlModule',
    'dressCtrlModule',
    'partyCtrlModule',
    'otherCtrlModule',

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
		'usersCtrlModule',
        'adminCtrlModule',
		'newProjectCtrlModule',

		'budgetCtrlModule',
		'restaurantCtrlModule',
		'arrangementCtrlModule',
        'programCtrlModule',
        'filmingCtrlModule',
        'registrationCtrlModule',
        'marriageCtrlModule',
        'transportCtrlModule',
		'dressCtrlModule',
        'partyCtrlModule',
        'otherCtrlModule',

		'authServices',
		'wedServices',

		'wedDerictives'
	]);

	wedInApp.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/start', {
            templateUrl : '/views/start_page/00_start_page.html',
            controller : 'wedUsersMainCtrl'

        }).when('/index', {
			templateUrl : '/views/home_page/00_home_page.html',
			controller : 'wedProjectsMainCtrl'

		}).when('/project', {
            templateUrl : '/views/projects/00_projects_main.html',
            controller : 'wedProjectsMainCtrl'

        }).when('/admin', {
            templateUrl : '/views/admin/00_00_admin_main.html',
            controller : 'adminMainCtrl'

        }).otherwise({
        	/*template : "<h1 style='color: #ffffff;'>404 Not Found By Me!</h1>"*/
            templateUrl : '/views/start_page/00_start_page.html',
            controller : 'wedUsersMainCtrl'
		});

	}]);

	
	return wedInApp;
});

