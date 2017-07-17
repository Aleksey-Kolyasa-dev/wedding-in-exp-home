require.config({
	baseUrl : '',
	paths : 
	{
		'app'             : '../js/app/app',
		'services'        : '../js/app/services/services',
		'controllers'     : '../js/app/controllers/01_wedMainCtrl',
		'newProjectCtrlModule' : '../js/app/controllers/02_wedMain_newProjectCtrl',
        'directives'     : '../js/app/directives/directives',
		'jQuery'		  : '../libs/js/jquery.min',
		'jQueryUI'        : '../libs/js/jquery-ui.min',
		'angular'         : '../libs/js/angular',
		'angularAnimate'  : '../libs/js/angular-animate.min',
		'angularToastr'	  : '../libs/js/angular-toastr.tpls.min',
		'angularRoute'	  : '../libs/js/angular_route',
		'twitterBootstrap' : '../libs/js/bootstrap.min',
		'angularRuLocale'  : 'https://code.angularjs.org/1.3.5/i18n/angular-locale_ru-by'
	},

	shim : 
	{
		'jQueryUI' : {
		 	deps : ['jQuery'],
			exports : 'jQueryUI'
		},
		'angular' : {
			deps : ['jQueryUI'],
			exports : 'angular'
		},
        'angularRoute' : {
            deps : ['angular'],
            exports : 'angularRoute'
        },
		'angularAnimate' : {
			deps : ['angularRoute'],
			exports : 'angularAnimate'
		},
		'angularToastr' : {
			deps : ['angularAnimate'],
			exports : 'angularToastr'
		},
        'newProjectCtrlModule' : {
            deps : ['controllers'],
            exports : 'newProjectCtrlModule'
        },
		'twitterBootstrap' : ['jQuery'],
		'app' : {
			deps : ['angularToastr', 'angularRoute','twitterBootstrap', 'services', 'newProjectCtrlModule', 'directives']
		}
	},

	deps : ['../js/bootstrap']

});